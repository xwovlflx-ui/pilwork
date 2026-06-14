# FillWork Backend Implementation v1.0

## 1. 구현 결과

Phase 5의 인증 및 조직 기반 백엔드를 PostgreSQL + Prisma + NestJS 구조로 전환했다. 기존 Next.js UI는 변경하지 않았으며, 프론트엔드 인증 어댑터를 통해 실제 DB 모드와 Mock 모드를 선택할 수 있다.

- PostgreSQL 16 로컬 개발 데이터베이스 연결
- Prisma 7 스키마, 마이그레이션, Seed 구성
- NestJS 인증 API 및 관리자 승인 API 구성
- RS256 JWT Access Token 및 회전형 Refresh Session 구성
- User / Organization / Membership / Session / AuditLog 실제 테이블 생성
- 로그인 상태 복원, 로그아웃, 권한별 라우팅, 승인 대기 흐름 연결
- 기존 `MockAuthApi` 보존

## 2. 시스템 구조

```text
Next.js 15 Web (:3000)
  -> lib/auth-api.ts
     -> database mode: NestJS API (:4000)
     -> mock mode: 기존 MockAuthApi

NestJS API
  -> Prisma Client
  -> Prisma PostgreSQL Adapter
  -> PostgreSQL 16 / fillwork_dev
```

## 3. 주요 파일

```text
FillWork/
├─ apps/api/
│  ├─ keys/.gitkeep
│  ├─ src/
│  │  ├─ admin/
│  │  ├─ auth/
│  │  ├─ prisma/
│  │  ├─ app.module.ts
│  │  ├─ health.controller.ts
│  │  └─ main.ts
│  └─ tsconfig.json
├─ prisma/
│  ├─ migrations/20260614090000_init_identity/migration.sql
│  ├─ migrations/migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ scripts/generate-auth-keys.mjs
├─ lib/auth-api.ts
├─ compose.yaml
├─ prisma.config.ts
└─ .env.example
```

개발용 RSA 개인키와 `.env`는 Git에서 제외한다. 공개 저장소에는 키 파일 자체가 아니라 생성 스크립트와 빈 디렉터리 표식만 포함한다.

## 4. 데이터 모델

### User

계정의 전역 신원 정보를 저장한다. 이메일은 소문자로 정규화하며 고유 인덱스를 사용한다. 비밀번호는 Argon2id 해시만 저장한다.

### Organization

워크스페이스 단위 조직을 저장한다. `slug`는 고유하며 조직 상태와 플랜 정보를 포함한다.

### Membership

사용자와 조직의 다대다 관계, 역할, 승인 상태를 저장한다. 동일 사용자의 조직별 권한과 승인 상태를 분리한다.

### Session

Refresh Token 원문 대신 SHA-256 해시와 세션 식별자를 저장한다. 조직 컨텍스트를 정확히 복원하도록 `membershipId`를 함께 보관한다.

### AuditLog

관리자 승인과 같은 보안·운영 이벤트의 수행자, 대상, 조직, 메타데이터를 기록한다.

## 5. 인증 흐름

### 로그인

1. 이메일과 비밀번호를 검증한다.
2. Argon2id로 비밀번호 해시를 확인한다.
3. 활성 또는 승인 대기 Membership을 결정한다.
4. 15분 수명의 RS256 Access Token을 발급한다.
5. 무작위 Refresh Secret의 해시를 Session에 저장한다.
6. `HttpOnly`, `SameSite=Lax` 쿠키로 Refresh Token을 전달한다.

### 세션 복원

앱 시작 시 `/api/auth/refresh`를 호출한다. Refresh Token을 회전하고 기존 토큰은 즉시 폐기한다. Access Token은 브라우저 저장소에 영구 저장하지 않고 메모리 상태에서 사용한다.

### 로그아웃

현재 Session을 폐기하고 Refresh Cookie를 제거한다. 이후 같은 Refresh Token으로 복원할 수 없다.

### 승인 대기

가입 Membership은 `PENDING`으로 생성된다. 로그인은 가능하지만 보호 라우터가 `/auth/pending`으로 이동시킨다. `ORG_ADMIN` 이상이 승인하면 Membership이 `ACTIVE`로 변경되고 감사 로그가 생성된다.

## 6. 역할 체계

| Prisma Role | 화면 권한 의미 |
|---|---|
| `SUPER_ADMIN` | 플랫폼 전체 관리자 |
| `ORG_ADMIN` | 조직 관리자 |
| `MANAGER` | 팀 및 업무 관리자 |
| `MEMBER` | 일반 구성원 및 현장 기사 |
| `GUEST` | 제한 접근 사용자 |

관리자 API는 `SUPER_ADMIN`, `ORG_ADMIN`만 접근할 수 있다. 프론트엔드 라우트 보호와 별개로 API에서도 Role Guard를 적용한다.

## 7. API 목록

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/api/health` | API 및 DB 연결 상태 |
| `POST` | `/api/auth/login` | 이메일 로그인 |
| `POST` | `/api/auth/register` | 조직 및 승인 대기 Membership 생성 |
| `POST` | `/api/auth/refresh` | Refresh Token 회전 및 세션 복원 |
| `POST` | `/api/auth/logout` | 세션 폐기 및 쿠키 삭제 |
| `POST` | `/api/auth/forgot-password` | 계정 존재 여부를 노출하지 않는 재설정 요청 응답 |
| `GET` | `/api/auth/me` | Access Token 기준 현재 사용자 |
| `GET` | `/api/admin/pending` | 승인 대기 사용자 목록 |
| `PATCH` | `/api/admin/:id/approve` | 역할 지정 및 가입 승인 |

Google 로그인 버튼은 현재 UI를 유지한다. OAuth Client ID와 Secret이 확정되지 않은 상태이므로 DB 모드에서는 미구현 안내를 반환하며, 임의의 우회 인증은 넣지 않았다.

## 8. Seed Data

`npm run prisma:seed`는 여러 번 실행해도 중복 생성되지 않도록 Upsert 기반으로 작성했다.

- 테스트 조직 1개
- Super Admin 1명
- Organization Admin 1명
- Field 테스트 계정 3명
- 승인 대기 계정 1명
- Membership 6개

개발 계정 정보는 Seed 실행 시 콘솔에 표시하며, 운영 환경에서는 Seed를 실행하지 않는다. 비밀번호는 `SEED_PASSWORD` 환경 변수로 반드시 지정한다.

## 9. 환경 변수

`.env.example`을 `.env`로 복제하고 다음 항목을 설정한다.

- `DATABASE_URL`
- `API_PORT`
- `WEB_ORIGIN`
- `JWT_PRIVATE_KEY_PATH`
- `JWT_PUBLIC_KEY_PATH`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_DAYS`
- `COOKIE_SECURE`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AUTH_MODE`

실제 DB 인증은 `NEXT_PUBLIC_AUTH_MODE=database`, 기존 데모 인증은 `NEXT_PUBLIC_AUTH_MODE=mock`으로 선택한다. API 장애 시 DB 인증을 조용히 Mock으로 전환하지 않는다. 인증 실패와 데이터 장애를 숨기지 않기 위한 의도적인 정책이다.

## 10. 로컬 실행

```powershell
npm install
npm run auth:keys
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run api:dev
npm run dev
```

프로덕션 빌드 확인:

```powershell
npm run build
```

PostgreSQL만 컨테이너로 실행할 경우 `compose.yaml`을 사용할 수 있다. 현재 개발 PC에는 PostgreSQL 16 서비스가 설치되어 있어 동일한 스키마를 로컬 서비스에 적용했다.

## 11. 검증 결과

- Prisma Schema validate 통과
- Prisma Client generate 통과
- 초기 Migration PostgreSQL 적용 통과
- `prisma migrate status`: 데이터베이스 최신 상태
- Seed 2회 연속 실행 후 중복 없음
- API TypeScript 빌드 통과
- Next.js 프로덕션 빌드 통과
- Health API DB 연결 확인
- 관리자 로그인 및 `/api/auth/me` 확인
- Refresh Token 회전 및 기존 토큰 폐기 확인
- 로그아웃 후 Refresh 401 확인
- 일반 사용자의 관리자 API 및 `/admin` 접근 차단 확인
- 승인 대기 사용자의 `/auth/pending` 이동 확인
- 관리자 승인 후 Membership 활성화 확인
- 브라우저 새로고침 후 세션 복원 확인
- 브라우저 Console warning/error 0건

## 12. 보안 결정

- 비밀번호: Argon2id
- Access Token: RS256, 짧은 만료, `jti` 포함
- Refresh Token: 고엔트로피 무작위 Secret, DB에는 해시만 저장
- Refresh Cookie: HttpOnly, SameSite=Lax, 운영 HTTPS에서 Secure 활성화
- CORS: 지정된 Web Origin과 credential 요청만 허용
- 입력 검증: NestJS ValidationPipe의 whitelist 및 변환 사용
- 감사 추적: 관리자 승인 시 AuditLog 기록
- 계정 열거 방지: 비밀번호 재설정 응답은 이메일 존재 여부와 무관하게 동일

## 13. 잔여 범위

이번 구현은 Phase 5 범위에 맞춰 인증과 조직 기반을 실제 DB로 전환했다. Dashboard, Project, Document, Chat, File, Admin 통계 데이터는 기존 Mock Data를 유지한다.

다음 데이터 전환 순서는 Organizations/Users 조회, Projects/Tasks, Documents, Chat, Files, Admin Stats가 적절하다. Google OAuth, 이메일 발송, 비밀번호 재설정 토큰, Rate Limit, 운영용 비밀 관리와 TLS 종료는 배포 단계에서 추가한다.

`npm audit --omit=dev --audit-level=high` 기준 High/Critical 취약점은 없다. 현재 Prisma CLI의 간접 개발 의존성과 Next.js 내부 PostCSS에 Moderate 5건이 보고되며, 자동 수정은 Prisma 또는 Next.js의 파괴적 다운그레이드를 제안하므로 적용하지 않았다. 상위 패키지의 호환 업데이트가 배포되면 재검증한다.
