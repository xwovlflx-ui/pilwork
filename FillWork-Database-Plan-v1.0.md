# FillWork Database Integration Plan v1.0

## 0. 문서 개요

- 상태: 구현 전 최종 전환 계획
- 작성일: 2026-06-13
- 현재 상태: Next.js UI + 브라우저 `localStorage` 기반 Mock Auth/Mock Data
- 목표 상태: NestJS API + PostgreSQL + Prisma ORM + Redis + AWS S3
- 이번 범위: 데이터 모델, Seed, API 연결, 마이그레이션 및 검증 계획
- 제외 범위: 실제 DB 생성, Prisma 설치, migration 실행, API 코드 수정, Mock 제거

이 문서는 현재 화면 컴포넌트 안에 분산된 Mock Data와 `localStorage` 기반 Mock Auth를 실제 PostgreSQL 데이터로 전환하기 위한 실행 기준이다. 기존 UI의 필드와 상태를 보존하되, 화면 표현용 값과 영속 데이터, 계산 지표를 명확히 분리한다.

## 1. 전환 원칙

1. **조직 단위 격리**: 모든 업무 데이터는 `organizationId`로 범위를 제한한다.
2. **승인은 Membership 상태로 관리**: 사용자 계정 상태와 조직 가입 승인 상태를 분리한다.
3. **UI 계약 유지**: 현재 컴포넌트가 기대하는 View Model을 API 응답 계층에서 제공한다.
4. **단계적 교체**: 도메인별로 Mock과 API를 교체하며 한 번에 전체 Mock을 삭제하지 않는다.
5. **파생 통계 우선**: 관리자 KPI는 원본 업무 데이터에서 계산하고 초기에는 별도 통계 테이블에 복제하지 않는다.
6. **파일 바이너리 분리**: PostgreSQL에는 파일 메타데이터만 저장하고 원본은 S3에 저장한다.
7. **재실행 가능한 Seed**: 고정 식별자와 `upsert`를 사용해 개발 Seed가 여러 번 실행되어도 중복되지 않게 한다.
8. **감사 가능성**: 승인, 역할, 프로젝트, 파일 공유 등 민감한 쓰기 작업은 `AuditLog`를 남긴다.

## 2. 현재 Mock Data 목록

### 2.1 사용자와 인증

근거 파일:

- `lib/mock-auth-api.ts`
- `types/auth.ts`
- `components/auth/auth-provider.tsx`
- `components/auth/admin-approval-panel.tsx`

현재 사용자 데이터:

| 이름 | 이메일 | 역할 | 상태 | 조직 |
|---|---|---|---|---|
| 서비스 관리자 | `super@fillwork.kr` | `SUPER_ADMIN` | active | FillWork 운영팀 |
| 김서현 | `admin@fillwork.kr` | `ORG_ADMIN` | active | 필워크 주식회사 |
| 박민수 | `manager@fillwork.kr` | `MANAGER` | active | 필워크 주식회사 |
| 이지연 | `member@fillwork.kr` | `MEMBER` | active | 필워크 주식회사 |
| 현장 협력자 | `guest@fillwork.kr` | `GUEST` | active | 필워크 주식회사 |
| 최도윤 | `pending@fillwork.kr` | `MEMBER` | pending | 필워크 주식회사 |

현재 저장 항목:

- 사용자: 이름, 이메일, 비밀번호 평문 Mock, 조직명, 초대코드, 역할, 승인 상태, 생성 시각
- 세션: Mock Token과 사용자 객체
- 저장 키: `fillwork.mock.users.v1`, `fillwork.mock.session.v1`
- Mock 기능: 로그인, Google 로그인, 회원가입, 로그아웃, 비밀번호 찾기, `getMe`, 승인 대기 조회, 관리자 승인

DB 전환 시 변경점:

- 비밀번호 평문을 Argon2id 해시로 교체한다.
- 역할과 승인 상태를 `Membership`으로 이동한다.
- Refresh Token 원문 대신 해시를 `Session`에 저장한다.
- Google 계정 식별자는 후속 `OAuthAccount` 지원 모델로 분리한다.
- 브라우저 `localStorage`의 사용자 목록과 세션을 완전히 폐기한다.

### 2.2 조직

근거 파일:

- `components/admin-center.tsx`
- `lib/mock-auth-api.ts`

현재 조직 데이터:

- 필워크 주식회사 / Business Plan
- FillWork 운영팀
- 현장운영본부: 3개 팀, 18명
- 기술지원본부: 2개 팀, 11명
- 고객경험본부: 2개 팀, 8명
- UI 표시값: 라이선스 42/60, 관리자 3명, 팀 리더 7명, 권한 정책 8개

전환 기준:

- `Organization`은 고객사 테넌트가 된다.
- 이번 핵심 스키마에서는 부서와 팀을 `Membership.departmentName`, `Membership.teamName` 문자열로 시작한다.
- 조직도 편집이 실제 기능으로 전환되는 시점에 `Department`, `Team` 모델을 별도 migration으로 정규화한다.
- 플랜과 좌석 수는 `Organization.plan`, `seatLimit`로 저장한다.

### 2.3 프로젝트

근거 파일:

- `components/project-board.tsx`
- `components/admin-center.tsx`
- `components/dashboard.tsx`
- `components/chat-workspace.tsx`
- `components/file-manager.tsx`

현재 프로젝트/현장 이름:

- 성수 물류센터
- 마포 리모델링
- 강남 고객사 구축
- 본사 네트워크 개선
- 네트워크 장비 교체

현재 표현 필드:

- 프로젝트명, 진행률, 현장명/주소, 상태, 우선순위
- 프로젝트별 채팅 채널
- 프로젝트별 문서와 파일
- 관리자 화면 주요 프로젝트 진행률

전환 기준:

- 동일 현장/프로젝트 명칭을 하나의 `Project` 레코드로 통합한다.
- 화면마다 다른 별칭은 Seed 단계에서 정리하고 `code`를 안정적인 외부 식별자로 사용한다.
- 프로젝트 접근 권한은 `ProjectMember` 지원 모델로 관리한다.

### 2.4 업무

근거 파일: `components/project-board.tsx`

현재 8개 칸반 업무:

1. 현장 안전 점검 체크리스트 정리
2. 고객사 주간 보고서 초안 작성
3. 마포 현장 사진 자동 분류 검수
4. 프로젝트 일정 및 담당자 업데이트
5. 신규 고객 온보딩 자료 제작
6. 속도측정 결과 AI 요약 확인
7. 5월 현장 운영 가이드 배포
8. 브랜드 가이드라인 개정 승인

현재 필드:

- 숫자형 Mock ID
- 제목
- 상태: `todo`, `doing`, `done`
- 담당자와 이니셜
- 마감일 문자열
- 우선순위: 긴급, 높음, 보통, 낮음
- 태그, 현장명, 첨부파일 개수

DB 전환 매핑:

| Mock | DB |
|---|---|
| `todo` | `TODO` |
| `doing` | `IN_PROGRESS` |
| `done` | `DONE` |
| 담당자 이름 | `assigneeId` FK |
| 마감일 문자열 | `dueAt timestamptz` |
| 태그 문자열 | `tags String[]` |
| 현장명 | 연결된 `Project`에서 조회 |
| 첨부파일 개수 | `FileAsset.taskId` count |

### 2.5 문서

근거 파일:

- `components/document-workspace.tsx`
- `components/dashboard.tsx`

현재 문서 데이터:

- 개인 문서: 업무 메모, 이번 주 할 일, 아이디어 노트, 개인 회의록
- 팀 문서: 현장 운영 가이드, 안전 점검 기준, 사진 촬영 규칙, 고객 확인 절차, 주간 업무 회의록, 프로젝트 위키
- 최근 문서: 고객사 미팅 노트, 속도측정 보고서
- Dashboard 최근 문서: 현장 운영 가이드, 주간 업무 회의록, 고객 관리 데이터베이스, 브랜드 가이드라인
- 본문 Mock: 체크리스트, 표, 코드 블록, 인용문, 토글, 현장 증빙, 속도측정, 고객 서명

현재 표현 필드:

- 제목, 아이콘, 커버, 상위 페이지, 즐겨찾기, 작성자, 수정 시각
- Tiptap을 전제로 한 블록 본문
- 공개 범위와 프로젝트 연결
- 댓글 수, 버전 정보, AI 보조 상태

전환 기준:

- 본문은 `Document.content Json`에 Tiptap JSON으로 저장한다.
- 검색용 텍스트는 `plainText`에 별도로 저장한다.
- 페이지 트리는 `parentId` self relation으로 표현한다.
- 버전은 `DocumentVersion` 지원 모델로 저장한다.
- 즐겨찾기는 사용자별 기능이므로 후속 `DocumentFavorite` 모델로 분리한다.

### 2.6 채팅

근거 파일: `components/chat-workspace.tsx`

현재 채널:

- 전체 공지
- 현장지원
- 기술문의
- 자유채팅
- 성수 물류센터
- 마포 리모델링
- 강남 고객사 구축

현재 참여자:

- 김지연 / 현장 매니저
- 박민수 / 기술 지원
- 이서연 / 고객 성공
- 최준호 / 프로젝트 리드

현재 메시지 표현:

- 작성자, 역할, 시각, 본문
- 읽음 표시, 날짜 구분선
- 파일/사진 첨부
- 이모지 반응
- 위치 공유
- 음성메모 AI 변환
- 고정 메시지와 공유 파일

전환 기준:

- 채널은 `ChatChannel`, 참여는 `ChannelMember`, 메시지는 `Message`로 저장한다.
- 첨부는 `Message.fileAssets` 명시적 다대다 지원 모델로 연결한다.
- 읽음은 `ChannelMember.lastReadMessageId`, `lastReadAt`으로 저장한다.
- 타이핑 상태와 접속 상태는 PostgreSQL이 아니라 Redis/Socket.io로 처리한다.

### 2.7 파일

근거 파일: `components/file-manager.tsx`

현재 현장 폴더:

- 성수 물류센터: 사진 38, 문서 6
- 마포 리모델링: 사진 24, 문서 4
- 강남 고객사 구축: 사진 17, 문서 8

현재 주요 파일:

- 성수 장비실_작업후.jpg
- 성수 장비실_작업전.jpg
- 네트워크 속도측정.pdf
- 고객 확인 서명.png
- 현장 장애 1차 보고서.docx
- 배선함 근접사진_03.jpg
- 고객 작업완료 확인서.pdf

현재 필드:

- 파일명, MIME 성격, 크기, 업로더, 업로드 시각
- 현장/프로젝트, 작업 전·후, 측정 결과, 고객 서명 분류
- AI 자동 태그와 신뢰도
- 활동 내역, 공유, 다운로드, 버전

전환 기준:

- 파일 원본은 S3, 메타데이터는 `FileAsset`에 저장한다.
- `storageKey`는 공개 URL이 아니라 비공개 Object Key다.
- `checksumSha256`과 `status`로 업로드 완료와 검역 상태를 관리한다.
- 태그는 초기에는 `String[]`, 검색/관리 요구가 커지면 `Tag` 모델로 정규화한다.

### 2.8 관리자 통계

근거 파일:

- `components/admin-center.tsx`
- `components/dashboard.tsx`

현재 KPI:

- 오늘 방문 12곳
- 미완료 업무 24건
- 활동 직원 38/42명
- 사진 업로드 186장
- 결재 대기 7건
- 긴급 이슈 3건
- 업무 처리량 1,248건, 전월 대비 14.2%
- 프로젝트 진행률 48~92%
- 속도측정 정상 92%, 평균 487 Mbps
- 사진 업로드 순위
- AI 사용량 6,842회

집계 전략:

| KPI | 초기 데이터 원천 |
|---|---|
| 미완료 업무 | `Task.status != DONE` |
| 직원 수/승인 대기 | `Membership.status`, `lastActiveAt` |
| 사진 업로드 | `FileAsset.category`, `createdAt` |
| 프로젝트 진행률 | 완료 Task / 전체 Task 또는 `Project.progress` 캐시 |
| 채팅 활동 | `Message.createdAt`, `authorId` |
| 문서 생성/수정 | `Document.createdAt`, `updatedAt` |
| 감사/접속 활동 | `AuditLog.createdAt`, `action` |

이번 핵심 스키마만으로 산출할 수 없는 방문, 속도측정, 장애, AI 사용량, 전자결재 KPI는 각각 `SiteVisit`, `SpeedTestResult`, `Incident`, `AiUsageEvent`, `Approval` 도메인 추가 후 API에 연결한다. 해당 KPI는 Core DB 전환 완료 기준에서 제외하고 후속 migration 전까지 UI에 `데이터 준비 중` 상태를 제공한다.

## 3. 목표 데이터 구조

### 3.1 핵심 모델

| 모델 | 책임 |
|---|---|
| `User` | 전역 사용자 계정과 로그인 식별자 |
| `Organization` | 고객사 테넌트와 플랜 설정 |
| `Membership` | 사용자-조직 관계, 역할, 승인 상태 |
| `Role` | 조직 내 권한 enum |
| `Project` | 현장/업무 프로젝트 |
| `Task` | 프로젝트 칸반 업무 |
| `Document` | 페이지 트리와 Tiptap 문서 |
| `ChatChannel` | 조직/프로젝트 채널 |
| `Message` | 채널 메시지 |
| `FileAsset` | S3 파일 메타데이터 |
| `Notification` | 인앱/이메일/푸시 알림 |
| `AuditLog` | 보안 및 중요 변경 이력 |

### 3.2 필수 지원 모델

- `Session`: Refresh Token 회전과 기기 로그아웃
- `ProjectMember`: 프로젝트별 접근 범위
- `DocumentVersion`: 문서 버전 복구
- `ChannelMember`: 채널 참여와 읽음 위치
- `MessageFile`: 메시지-파일 연결

### 3.3 멀티테넌트 규칙

- `Organization`, `User`를 제외한 업무 모델은 조직 범위를 가진다.
- API에서 JWT의 `organizationId`를 사용하며 클라이언트가 보낸 조직 ID를 권한 근거로 사용하지 않는다.
- 모든 단건 조회는 `id + organizationId` 조건을 사용한다.
- 복합 Unique와 Index는 가능한 한 `organizationId`를 선두 컬럼으로 둔다.
- `SUPER_ADMIN`은 플랫폼 운영자 역할이며 고객 조직의 일반 Membership과 분리된 사용을 권장한다.

## 4. Prisma Schema 최종안

기준은 Prisma ORM 7 + PostgreSQL이다. Prisma 7의 ESM-first `prisma-client` generator, `prisma.config.ts` datasource 설정, PostgreSQL driver adapter 적용을 전제로 한다.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum MembershipStatus {
  INVITED
  PENDING
  ACTIVE
  SUSPENDED
  REJECTED
  LEFT
}

enum Role {
  SUPER_ADMIN
  ORG_ADMIN
  MANAGER
  MEMBER
  GUEST
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  ARCHIVED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum DocumentVisibility {
  PRIVATE
  PROJECT
  ORGANIZATION
}

enum ChannelType {
  DIRECT
  GROUP
  ORGANIZATION
  PROJECT
}

enum MessageType {
  TEXT
  FILE
  IMAGE
  LOCATION
  VOICE
  SYSTEM
}

enum FileCategory {
  GENERAL
  FIELD_BEFORE
  FIELD_AFTER
  SPEED_TEST
  CUSTOMER_SIGNATURE
  REPORT
}

enum FileStatus {
  UPLOADING
  PROCESSING
  READY
  QUARANTINED
  DELETED
}

enum NotificationChannel {
  IN_APP
  EMAIL
  PUSH
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}

model User {
  id               String       @id @default(uuid()) @db.Uuid
  email            String       @unique @db.VarChar(320)
  passwordHash     String?      @map("password_hash") @db.VarChar(255)
  name             String       @db.VarChar(100)
  phone            String?      @db.VarChar(30)
  avatarUrl        String?      @map("avatar_url")
  status           UserStatus   @default(ACTIVE)
  tokenVersion     Int          @default(1) @map("token_version")
  emailVerifiedAt  DateTime?    @map("email_verified_at") @db.Timestamptz(3)
  lastLoginAt      DateTime?    @map("last_login_at") @db.Timestamptz(3)
  createdAt        DateTime     @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt        DateTime     @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt        DateTime?    @map("deleted_at") @db.Timestamptz(3)

  memberships      Membership[] @relation("MembershipUser")
  invitedMemberships Membership[] @relation("MembershipInviter")
  approvedMemberships Membership[] @relation("MembershipApprover")
  sessions         Session[]
  projectMemberships ProjectMember[]
  assignedTasks    Task[]       @relation("TaskAssignee")
  createdTasks     Task[]       @relation("TaskCreator")
  createdDocuments Document[]   @relation("DocumentCreator")
  updatedDocuments Document[]   @relation("DocumentUpdater")
  documentVersions DocumentVersion[]
  channelMemberships ChannelMember[]
  createdChannels  ChatChannel[]
  messages         Message[]
  uploadedFiles    FileAsset[]
  notifications    Notification[]
  auditLogs        AuditLog[]   @relation("AuditActor")

  @@index([status, createdAt])
  @@map("users")
}

model Organization {
  id            String       @id @default(uuid()) @db.Uuid
  name          String       @db.VarChar(120)
  slug          String       @unique @db.VarChar(80)
  plan          String       @default("BUSINESS") @db.VarChar(30)
  seatLimit     Int          @default(20) @map("seat_limit")
  settings      Json         @default("{}")
  createdAt     DateTime     @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt     DateTime     @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt     DateTime?    @map("deleted_at") @db.Timestamptz(3)

  memberships   Membership[]
  projects      Project[]
  tasks         Task[]
  documents     Document[]
  channels      ChatChannel[]
  files         FileAsset[]
  notifications Notification[]
  auditLogs     AuditLog[]

  @@index([deletedAt])
  @@map("organizations")
}

model Membership {
  id             String           @id @default(uuid()) @db.Uuid
  organizationId String           @map("organization_id") @db.Uuid
  userId         String           @map("user_id") @db.Uuid
  role           Role             @default(GUEST)
  status         MembershipStatus @default(PENDING)
  departmentName String?          @map("department_name") @db.VarChar(100)
  teamName       String?          @map("team_name") @db.VarChar(100)
  title          String?          @db.VarChar(100)
  invitedById    String?          @map("invited_by_id") @db.Uuid
  approvedById   String?          @map("approved_by_id") @db.Uuid
  approvedAt     DateTime?        @map("approved_at") @db.Timestamptz(3)
  rejectedAt     DateTime?        @map("rejected_at") @db.Timestamptz(3)
  statusReason   String?          @map("status_reason") @db.VarChar(500)
  lastActiveAt   DateTime?        @map("last_active_at") @db.Timestamptz(3)
  createdAt      DateTime         @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime         @updatedAt @map("updated_at") @db.Timestamptz(3)

  organization   Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User             @relation("MembershipUser", fields: [userId], references: [id], onDelete: Cascade)
  invitedBy      User?            @relation("MembershipInviter", fields: [invitedById], references: [id], onDelete: SetNull)
  approvedBy     User?            @relation("MembershipApprover", fields: [approvedById], references: [id], onDelete: SetNull)

  @@unique([organizationId, userId])
  @@index([organizationId, status, role])
  @@index([userId, status])
  @@map("memberships")
}

model Session {
  id               String    @id @default(uuid()) @db.Uuid
  userId           String    @map("user_id") @db.Uuid
  familyId         String    @map("family_id") @db.Uuid
  refreshTokenHash String    @unique @map("refresh_token_hash") @db.VarChar(64)
  userAgent        String?   @map("user_agent")
  ipAddress        String?   @map("ip_address") @db.Inet
  expiresAt        DateTime  @map("expires_at") @db.Timestamptz(3)
  revokedAt        DateTime? @map("revoked_at") @db.Timestamptz(3)
  createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz(3)
  lastUsedAt       DateTime? @map("last_used_at") @db.Timestamptz(3)

  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, expiresAt])
  @@index([familyId])
  @@map("sessions")
}

model Project {
  id             String        @id @default(uuid()) @db.Uuid
  organizationId String        @map("organization_id") @db.Uuid
  code           String        @db.VarChar(40)
  name           String        @db.VarChar(160)
  description    String?
  status         ProjectStatus @default(PLANNING)
  priority       Priority      @default(NORMAL)
  siteAddress    String?       @map("site_address")
  siteLat        Decimal?      @map("site_lat") @db.Decimal(10, 7)
  siteLng        Decimal?      @map("site_lng") @db.Decimal(10, 7)
  startsAt       DateTime?     @map("starts_at") @db.Timestamptz(3)
  dueAt          DateTime?     @map("due_at") @db.Timestamptz(3)
  progress       Int           @default(0) @db.SmallInt
  version        Int           @default(1)
  createdAt      DateTime      @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime      @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt      DateTime?     @map("deleted_at") @db.Timestamptz(3)

  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  members        ProjectMember[]
  tasks          Task[]
  documents      Document[]
  channels       ChatChannel[]
  files          FileAsset[]

  @@unique([organizationId, code])
  @@index([organizationId, status, updatedAt(sort: Desc)])
  @@map("projects")
}

model ProjectMember {
  id        String   @id @default(uuid()) @db.Uuid
  projectId String   @map("project_id") @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  role      Role     @default(MEMBER)
  joinedAt  DateTime @default(now()) @map("joined_at") @db.Timestamptz(3)

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([userId, projectId])
  @@map("project_members")
}

model Task {
  id             String     @id @default(uuid()) @db.Uuid
  organizationId String     @map("organization_id") @db.Uuid
  projectId      String     @map("project_id") @db.Uuid
  title          String     @db.VarChar(240)
  description    String?
  status         TaskStatus @default(TODO)
  priority       Priority   @default(NORMAL)
  assigneeId     String?    @map("assignee_id") @db.Uuid
  createdById    String     @map("created_by_id") @db.Uuid
  dueAt          DateTime?  @map("due_at") @db.Timestamptz(3)
  completedAt    DateTime?  @map("completed_at") @db.Timestamptz(3)
  sortOrder      Decimal    @default(1000) @map("sort_order") @db.Decimal(20, 6)
  tags           String[]
  checklist      Json       @default("[]")
  version        Int        @default(1)
  createdAt      DateTime   @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime   @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt      DateTime?  @map("deleted_at") @db.Timestamptz(3)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  project        Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee       User?      @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  createdBy      User       @relation("TaskCreator", fields: [createdById], references: [id])
  files          FileAsset[]

  @@index([organizationId, status, dueAt])
  @@index([projectId, status, sortOrder])
  @@index([assigneeId, status, dueAt])
  @@map("tasks")
}

model Document {
  id             String             @id @default(uuid()) @db.Uuid
  organizationId String             @map("organization_id") @db.Uuid
  projectId      String?            @map("project_id") @db.Uuid
  parentId       String?            @map("parent_id") @db.Uuid
  title          String             @db.VarChar(240)
  icon           String?            @db.VarChar(32)
  coverUrl       String?            @map("cover_url")
  content        Json               @default("{}")
  plainText      String             @default("") @map("plain_text")
  visibility     DocumentVisibility @default(PRIVATE)
  createdById    String             @map("created_by_id") @db.Uuid
  updatedById    String             @map("updated_by_id") @db.Uuid
  version        Int                @default(1)
  createdAt      DateTime           @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime           @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt      DateTime?          @map("deleted_at") @db.Timestamptz(3)

  organization   Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  project        Project?           @relation(fields: [projectId], references: [id], onDelete: SetNull)
  parent         Document?          @relation("DocumentTree", fields: [parentId], references: [id], onDelete: SetNull)
  children       Document[]         @relation("DocumentTree")
  createdBy      User               @relation("DocumentCreator", fields: [createdById], references: [id])
  updatedBy      User               @relation("DocumentUpdater", fields: [updatedById], references: [id])
  versions       DocumentVersion[]
  files          FileAsset[]

  @@index([organizationId, parentId, updatedAt(sort: Desc)])
  @@index([organizationId, projectId, updatedAt(sort: Desc)])
  @@map("documents")
}

model DocumentVersion {
  id         String   @id @default(uuid()) @db.Uuid
  documentId String   @map("document_id") @db.Uuid
  version    Int
  title      String   @db.VarChar(240)
  content    Json
  createdById String  @map("created_by_id") @db.Uuid
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz(3)

  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  createdBy  User     @relation(fields: [createdById], references: [id])

  @@unique([documentId, version])
  @@index([documentId, createdAt(sort: Desc)])
  @@map("document_versions")
}

model ChatChannel {
  id             String      @id @default(uuid()) @db.Uuid
  organizationId String      @map("organization_id") @db.Uuid
  projectId      String?     @map("project_id") @db.Uuid
  type           ChannelType
  name           String?     @db.VarChar(120)
  description    String?
  isPrivate      Boolean     @default(false) @map("is_private")
  createdById    String      @map("created_by_id") @db.Uuid
  lastMessageAt  DateTime?   @map("last_message_at") @db.Timestamptz(3)
  createdAt      DateTime    @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime    @updatedAt @map("updated_at") @db.Timestamptz(3)
  archivedAt     DateTime?   @map("archived_at") @db.Timestamptz(3)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  project        Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)
  createdBy      User         @relation(fields: [createdById], references: [id])
  members        ChannelMember[]
  messages       Message[]

  @@index([organizationId, type, updatedAt(sort: Desc)])
  @@index([projectId, archivedAt])
  @@map("chat_channels")
}

model ChannelMember {
  id                String    @id @default(uuid()) @db.Uuid
  channelId         String    @map("channel_id") @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  lastReadMessageId String?   @map("last_read_message_id") @db.Uuid
  lastReadAt        DateTime? @map("last_read_at") @db.Timestamptz(3)
  joinedAt          DateTime  @default(now()) @map("joined_at") @db.Timestamptz(3)
  mutedAt           DateTime? @map("muted_at") @db.Timestamptz(3)

  channel           ChatChannel @relation(fields: [channelId], references: [id], onDelete: Cascade)
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastReadMessage   Message?     @relation("LastReadMessage", fields: [lastReadMessageId], references: [id], onDelete: SetNull)

  @@unique([channelId, userId])
  @@index([userId, lastReadAt])
  @@map("channel_members")
}

model Message {
  id          String      @id @default(uuid()) @db.Uuid
  channelId   String      @map("channel_id") @db.Uuid
  authorId    String      @map("author_id") @db.Uuid
  replyToId   String?     @map("reply_to_id") @db.Uuid
  clientId    String      @map("client_id") @db.VarChar(80)
  type        MessageType @default(TEXT)
  body        String      @default("")
  metadata    Json        @default("{}")
  reactions   Json        @default("{}")
  createdAt   DateTime    @default(now()) @map("created_at") @db.Timestamptz(3)
  editedAt    DateTime?   @map("edited_at") @db.Timestamptz(3)
  deletedAt   DateTime?   @map("deleted_at") @db.Timestamptz(3)

  channel     ChatChannel @relation(fields: [channelId], references: [id], onDelete: Cascade)
  author      User        @relation(fields: [authorId], references: [id])
  replyTo     Message?    @relation("MessageReplies", fields: [replyToId], references: [id], onDelete: SetNull)
  replies     Message[]   @relation("MessageReplies")
  readBy      ChannelMember[] @relation("LastReadMessage")
  files       MessageFile[]

  @@unique([channelId, clientId])
  @@index([channelId, createdAt(sort: Desc)])
  @@index([authorId, createdAt(sort: Desc)])
  @@map("messages")
}

model MessageFile {
  messageId String @map("message_id") @db.Uuid
  fileId    String @map("file_id") @db.Uuid

  message   Message   @relation(fields: [messageId], references: [id], onDelete: Cascade)
  file      FileAsset @relation(fields: [fileId], references: [id], onDelete: Cascade)

  @@id([messageId, fileId])
  @@map("message_files")
}

model FileAsset {
  id             String       @id @default(uuid()) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  projectId      String?      @map("project_id") @db.Uuid
  taskId         String?      @map("task_id") @db.Uuid
  documentId     String?      @map("document_id") @db.Uuid
  uploadedById   String       @map("uploaded_by_id") @db.Uuid
  name           String       @db.VarChar(255)
  mimeType       String       @map("mime_type") @db.VarChar(120)
  extension      String?      @db.VarChar(20)
  sizeBytes      BigInt       @map("size_bytes")
  storageKey     String       @map("storage_key")
  checksumSha256 String       @map("checksum_sha256") @db.VarChar(64)
  category       FileCategory @default(GENERAL)
  status         FileStatus   @default(UPLOADING)
  versionNo      Int          @default(1) @map("version_no")
  tags           String[]
  metadata       Json         @default("{}")
  createdAt      DateTime     @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt      DateTime     @updatedAt @map("updated_at") @db.Timestamptz(3)
  deletedAt      DateTime?    @map("deleted_at") @db.Timestamptz(3)

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  project        Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)
  task           Task?        @relation(fields: [taskId], references: [id], onDelete: SetNull)
  document       Document?    @relation(fields: [documentId], references: [id], onDelete: SetNull)
  uploadedBy     User         @relation(fields: [uploadedById], references: [id])
  messages       MessageFile[]

  @@unique([organizationId, storageKey])
  @@index([organizationId, category, createdAt(sort: Desc)])
  @@index([projectId, createdAt(sort: Desc)])
  @@index([taskId])
  @@index([documentId])
  @@map("file_assets")
}

model Notification {
  id             String             @id @default(uuid()) @db.Uuid
  organizationId String             @map("organization_id") @db.Uuid
  userId         String             @map("user_id") @db.Uuid
  type           String             @db.VarChar(80)
  title          String             @db.VarChar(160)
  body           String
  data           Json               @default("{}")
  channel        NotificationChannel @default(IN_APP)
  status         NotificationStatus @default(PENDING)
  dedupeKey      String             @map("dedupe_key") @db.VarChar(160)
  readAt         DateTime?          @map("read_at") @db.Timestamptz(3)
  sentAt         DateTime?          @map("sent_at") @db.Timestamptz(3)
  failedAt       DateTime?          @map("failed_at") @db.Timestamptz(3)
  createdAt      DateTime           @default(now()) @map("created_at") @db.Timestamptz(3)

  organization   Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, dedupeKey])
  @@index([userId, readAt, createdAt(sort: Desc)])
  @@index([status, createdAt])
  @@map("notifications")
}

model AuditLog {
  id             String        @id @default(uuid()) @db.Uuid
  organizationId String?       @map("organization_id") @db.Uuid
  actorId        String?       @map("actor_id") @db.Uuid
  action         String        @db.VarChar(100)
  resourceType   String?       @map("resource_type") @db.VarChar(80)
  resourceId     String?       @map("resource_id") @db.Uuid
  before         Json?
  after          Json?
  metadata       Json          @default("{}")
  ipAddress      String?       @map("ip_address") @db.Inet
  userAgent      String?       @map("user_agent")
  requestId      String        @map("request_id") @db.Uuid
  createdAt      DateTime      @default(now()) @map("created_at") @db.Timestamptz(3)

  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  actor          User?         @relation("AuditActor", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([organizationId, createdAt(sort: Desc)])
  @@index([resourceType, resourceId, createdAt(sort: Desc)])
  @@index([actorId, createdAt(sort: Desc)])
  @@map("audit_logs")
}
```

### 4.1 스키마 후속 확장

Core 전환 이후 별도 migration으로 추가한다.

| 모델 | 필요 화면/기능 |
|---|---|
| `OAuthAccount` | 실제 Google 로그인 |
| `PasswordResetToken`, `EmailVerificationToken` | 실제 이메일 인증/재설정 |
| `Department`, `Team` | 조직도와 팀 관리 |
| `TaskComment`, `TaskChecklistItem` | 프로젝트 상세 기능 |
| `DocumentComment`, `DocumentFavorite` | 댓글과 즐겨찾기 |
| `FileVersion`, `FileShareLink`, `FilePermission` | 버전, 공유 링크, 권한 |
| `SiteVisit` | 오늘 방문 현황 |
| `SpeedTestResult` | 속도측정 통계 |
| `Incident` | 미처리 장애와 긴급 이슈 |
| `AiUsageEvent` | AI 사용량과 비용 |
| `Approval`, `ApprovalStep` | 전자결재와 결재 대기 KPI |

## 5. 인증 전환 계획

### 5.1 Mock Token → JWT

현재:

- `mock.<base64 payload>.fillwork`
- `localStorage`에 세션 전체 저장
- 서명, 만료 검증, Refresh Token 회전 없음

목표:

- Access Token: RS256 또는 ES256 JWT, 15분 만료
- Refresh Token: 30일, HttpOnly + Secure + SameSite=Lax 쿠키
- Refresh Token 해시: `Session.refreshTokenHash`
- Claims: `sub`, `sid`, `organizationId`, `membershipId`, `role`, `tokenVersion`, `iat`, `exp`
- 키 회전: `kid`를 포함하고 운영 키는 Secrets Manager에서 관리
- Refresh Token 재사용 감지 시 동일 `familyId` 세션 전체 폐기

전환 단계:

1. NestJS `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`를 구현한다.
2. `AuthProvider`의 공개 메서드는 유지하고 내부 호출만 `mockAuthApi`에서 HTTP client로 교체한다.
3. 사용자 객체를 `localStorage`에 저장하지 않고 `GET /auth/me`로 복원한다.
4. Access Token은 메모리에 보관하고 새로고침 시 Refresh Cookie로 복구한다.
5. Mock Token 코드와 Mock 세션 키를 제거한다.

### 5.2 Mock User → DB User

- 이메일은 저장 전에 trim + lowercase 정규화한다.
- DB에는 비밀번호 해시만 저장한다.
- 로그인 응답은 `User`와 현재 `Membership`의 최소 View Model만 반환한다.
- 한 사용자가 여러 조직에 가입할 가능성을 고려해 조직 선택/전환 API를 준비한다.
- 기존 Auth UI 역할 명칭은 DB `Role` enum과 동일하게 유지한다.

### 5.3 승인 대기 상태

- 신규 계정 자체는 `User.status=ACTIVE`로 생성할 수 있지만, 업무 접근은 `Membership.status=PENDING`이 차단한다.
- 관리자 승인 시 `Membership.status=ACTIVE`, `role`, `approvedById`, `approvedAt`을 한 트랜잭션에서 변경한다.
- 승인과 동시에 `Notification`과 `AuditLog`를 생성한다.
- 거절 시 `REJECTED`, 사유, 처리 시각을 기록한다.
- 승인 후 기존 Access Token을 즉시 갱신하도록 클라이언트가 `/auth/refresh` 또는 재로그인을 수행한다.

### 5.4 권한별 접근 제어

Guard 순서:

```text
JwtAuthGuard
→ OrganizationContextGuard
→ ActiveMembershipGuard
→ PermissionGuard
→ ResourceScopePolicy
```

| 역할 | 기본 범위 |
|---|---|
| `SUPER_ADMIN` | 플랫폼 운영 범위, 고객 조직 접근은 감사 대상 |
| `ORG_ADMIN` | 조직 전체와 Admin API |
| `MANAGER` | 소속 프로젝트/팀 관리 |
| `MEMBER` | 배정 프로젝트의 일반 협업 |
| `GUEST` | 명시적으로 공유된 프로젝트/채널/문서 읽기 중심 |

클라이언트 `AuthRouteGuard`는 UX 보호용으로 유지하지만 실제 권한의 최종 판정은 NestJS에서 수행한다.

## 6. Seed Data 계획

### 6.1 실행 방식

- 파일 예정 위치: `prisma/seed.ts`
- Prisma 7 기준 `prisma.config.ts`의 `migrations.seed`에 `tsx prisma/seed.ts` 등록
- 실행: `npx prisma db seed`
- 환경 구분: `npx prisma db seed -- --environment development`
- 모든 핵심 레코드는 고정 UUID/slug/code와 `upsert` 사용
- 운영 환경에서는 개발 Seed 실행 금지

### 6.2 개발용 사용자

| 역할 | 이메일 | Membership |
|---|---|---|
| Super Admin | `super@fillwork.local` | 운영 조직 ACTIVE |
| Org Admin | `admin@fillwork.local` | 테스트 조직 ACTIVE |
| Manager | `manager@fillwork.local` | 테스트 조직 ACTIVE |
| Member | `member@fillwork.local` | 테스트 조직 ACTIVE |
| Guest | `guest@fillwork.local` | 테스트 조직 ACTIVE |
| Pending | `pending@fillwork.local` | 테스트 조직 PENDING |

규칙:

- Seed 비밀번호는 환경변수 `SEED_DEFAULT_PASSWORD`에서 읽는다.
- 기본 비밀번호를 코드와 문서에 평문으로 넣지 않는다.
- 모든 Seed 계정은 비운영 이메일 도메인을 사용한다.

### 6.3 테스트 조직

```text
Organization
- name: 필워크 테스트 주식회사
- slug: fillwork-demo
- plan: BUSINESS
- seatLimit: 60
```

Membership 메타데이터:

- 현장운영본부 / 운영 1팀
- 기술지원본부 / 기술지원팀
- 고객경험본부 / 고객경험팀
- PMO / 프로젝트 관리팀

### 6.4 테스트 프로젝트와 업무

프로젝트:

1. `SITE-SEONGSU` / 성수 물류센터 / ACTIVE / 진행률 86
2. `SITE-MAPO` / 마포 리모델링 / ACTIVE / 진행률 64
3. `SITE-GANGNAM` / 강남 고객사 구축 / ACTIVE / 진행률 48
4. `HQ-NETWORK` / 본사 네트워크 개선 / ACTIVE / 진행률 92

업무:

- 현재 칸반의 8개 업무를 상태, 담당자, 마감일, 우선순위, 태그와 함께 생성한다.
- `sortOrder`는 컬럼별 `1000`, `2000`, `3000` 간격으로 배치한다.
- 완료 업무에는 `completedAt`을 설정한다.

### 6.5 테스트 문서

- 현장 운영 가이드를 루트 팀 문서로 생성한다.
- 안전 점검 기준, 사진 촬영 규칙, 고객 확인 절차를 하위 문서로 생성한다.
- 주간 업무 회의록, 프로젝트 위키, 개인 업무 메모를 추가한다.
- 본문은 실제 Tiptap JSON 최소 예제로 저장한다.
- 각 문서에 최초 `DocumentVersion`을 생성한다.

### 6.6 테스트 채팅

- 조직 채널: 전체 공지, 현장지원, 기술문의, 자유채팅
- 프로젝트 채널: 성수 물류센터, 마포 리모델링, 강남 고객사 구축
- 활성 사용자들을 `ChannelMember`로 연결한다.
- 텍스트, 이미지, 위치, 음성 변환 예시 메시지를 시간순으로 생성한다.
- 읽음 위치를 다르게 설정해 UI의 unread badge를 재현한다.

### 6.7 테스트 파일

- DB에는 7개 FileAsset 메타데이터를 생성한다.
- 실제 S3 업로드 전 Seed 파일은 `storageKey=seed/...`와 `status=READY`를 사용한다.
- 로컬 개발에서 썸네일이 필요하면 `public/seed-assets` 정적 샘플과 metadata URL을 사용한다.
- S3 연결 이후 별도 스크립트로 Seed 바이너리를 업로드한다.

## 7. API 연결 순서

### 7.1 1단계: Auth

API:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password/forgot`
- `GET /api/v1/auth/me`

완료 조건:

- 새로고침 후 로그인 유지
- pending 사용자의 업무 API 403
- Refresh Token 회전/폐기 동작
- Mock Auth 저장 키 제거 가능

### 7.2 2단계: Users

API:

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/admin/members`
- `GET /api/v1/admin/members/pending`
- `POST /api/v1/admin/members/:membershipId/approve`
- `POST /api/v1/admin/members/:membershipId/reject`
- `PATCH /api/v1/admin/members/:membershipId/role`

완료 조건:

- 프로필 메뉴가 DB 사용자 표시
- Admin 승인 카드가 DB Membership 표시
- 승인/역할 변경 AuditLog 생성

### 7.3 3단계: Organizations

API:

- `GET /api/v1/organizations/current`
- `PATCH /api/v1/organizations/current`
- `GET /api/v1/organizations/current/members`

완료 조건:

- 사이드바 조직명, 플랜, 좌석 수 DB 연결
- 조직 간 사용자/데이터 격리 테스트 통과

### 7.4 4단계: Projects

API:

- 프로젝트 CRUD
- 프로젝트 멤버 조회/수정
- Task 목록/생성/수정/이동/삭제

완료 조건:

- 칸반 3개 컬럼을 API 데이터로 표시
- 드래그 이동이 `status + sortOrder + version` 갱신
- 담당자와 첨부 수가 관계 데이터에서 계산

### 7.5 5단계: Documents

API:

- 문서 트리/상세/생성/수정/삭제
- 문서 버전 목록/복원

완료 조건:

- 페이지 트리와 에디터가 DB 데이터 사용
- Tiptap JSON 저장/복원 round-trip
- version 충돌 시 409 처리

### 7.6 6단계: Chat

API/Socket:

- 채널 목록/생성/멤버
- 메시지 cursor pagination
- Socket.io 메시지 생성/수정/삭제/읽음

완료 조건:

- 채널별 메시지와 unread 수 DB 연결
- 재연결 후 중복 메시지 없음
- 다른 채널/조직 메시지 접근 차단

### 7.7 7단계: Files

API:

- 업로드 URL 발급
- 업로드 완료 검증
- 목록/상세/다운로드 URL/삭제

완료 조건:

- 브라우저→S3 직접 업로드
- DB FileAsset 생성과 상태 전이
- 프로젝트/업무/문서 첨부 조회
- 조직 외 파일 다운로드 차단

### 7.8 8단계: Admin Stats

API:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/stats/tasks`
- `GET /api/v1/admin/stats/projects`
- `GET /api/v1/admin/stats/activity`
- `GET /api/v1/admin/stats/files`

초기 구현:

- PostgreSQL 집계 Query를 사용한다.
- 요청 기간과 organizationId를 필수 조건으로 둔다.
- 느린 집계만 Redis 1~5분 캐시를 적용한다.
- 데이터 규모와 부하가 확인되기 전 Materialized View를 만들지 않는다.

## 8. 마이그레이션 순서

### Migration 0: 기반 설정

- PostgreSQL 개발/테스트 DB 준비
- Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx` 도입 계획 확정
- `prisma.config.ts`, `schema.prisma`, generated client 경로 결정
- UUID, `timestamptz`, timezone UTC 기준 확정

### Migration 1: Identity

- `users`
- `organizations`
- `memberships`
- `sessions`
- Role/Status enums
- 이메일 정규화 Unique 정책

검증 후 Auth API만 연결한다.

### Migration 2: Project

- `projects`
- `project_members`
- `tasks`
- 업무 상태/정렬/담당자 인덱스

### Migration 3: Document

- `documents`
- `document_versions`
- self relation과 프로젝트 관계

### Migration 4: Chat

- `chat_channels`
- `channel_members`
- `messages`
- unread/cursor 인덱스

### Migration 5: File

- `file_assets`
- `message_files`
- S3 업로드 상태와 체크섬

### Migration 6: Notification/Audit

- `notifications`
- `audit_logs`
- 승인, 역할, 프로젝트, 파일 행위 기록 연결

### Migration 7: Seed/Integration

- 개발 Seed 적용
- 도메인별 API 연결
- Mock/API feature flag 운영
- UI 회귀 검증 후 Mock 제거

### Migration 8: Field/Admin Extensions

- 방문, 속도측정, 장애, AI 사용량, 전자결재 모델
- 관리자 KPI 완전 전환

### 환경별 실행 정책

| 환경 | 명령/정책 |
|---|---|
| Local | `prisma migrate dev` |
| Test/CI | 빈 DB에 `prisma migrate deploy` 후 test seed |
| Staging | 백업 후 `prisma migrate deploy`, smoke test |
| Production | CI/CD에서 `prisma migrate deploy`, 수동 `migrate dev` 금지 |

Migration SQL은 생성 후 검토하며 컬럼 rename, enum 전환, 부분 인덱스 등은 `--create-only`로 SQL을 수정한다.

## 9. Mock → API 교체 전략

### 9.1 Adapter 경계

현재 컴포넌트가 직접 배열을 참조하는 구조를 다음 계층으로 교체한다.

```text
UI Component
→ React Query hook
→ typed API client
→ NestJS Controller
→ Application Service
→ Prisma Repository
→ PostgreSQL
```

### 9.2 View Model 유지

DB 레코드를 UI가 직접 소비하지 않는다. 예:

```text
Task + User + FileAsset count
→ ProjectTaskCardView
  - id
  - title
  - status
  - assignee { id, name, avatarUrl, initials }
  - dueAt
  - priority
  - tags
  - location
  - attachmentCount
```

이 방식으로 UI의 데이터 모양을 유지하면서 DB 구조를 정규화할 수 있다.

### 9.3 Feature Flag

- `NEXT_PUBLIC_DATA_SOURCE=mock|api`
- 도메인별 flag가 필요하면 `AUTH_DATA_SOURCE`, `PROJECT_DATA_SOURCE`처럼 서버 설정에서 관리
- 운영 환경에서 Mock fallback 금지
- API 오류가 발생하면 Empty/Error UI를 표시하고 Mock 값을 대신 보여주지 않는다.

## 10. 위험 요소와 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 역할 명칭 불일치 | 기존 Backend 문서와 Auth 구현 간 권한 오류 | 현재 Auth의 5개 Role을 canonical로 확정하고 이전 enum 폐기 |
| 사용자 상태와 승인 상태 혼용 | 여러 조직 가입/정지 처리 불가 | 계정은 User, 조직 승인은 Membership으로 분리 |
| 조직 조건 누락 | 심각한 테넌트 데이터 유출 | Repository 계층 organizationId 강제, 교차 조직 통합 테스트 |
| localStorage 세션 잔존 | JWT 전환 후 잘못된 로그인 상태 | 전환 릴리스에서 Mock 키 제거 migration 실행 |
| Seed 평문 비밀번호 | 개발 계정 유출 | 환경변수 + Argon2id, production seed 차단 |
| Prisma enum 변경 | Production migration 난이도 증가 | enum은 안정화 후 도입, 변경 시 create-only SQL 검토 |
| 문서 JSON 크기 증가 | 저장/조회 지연 | plainText 분리, 버전 보존 정책, 대형 문서 부하 테스트 |
| 채팅 메시지 폭증 | 목록/검색 성능 저하 | channelId+createdAt cursor index, 보존/파티셔닝 추후 검토 |
| 파일 DB/S3 불일치 | 유실 또는 고아 객체 | 업로드 상태 머신, checksum, 정리 Worker |
| 관리자 집계 N+1 | Dashboard 지연 | 단일 집계 query, 기간 인덱스, Redis 단기 캐시 |
| Task 순서 충돌 | 동시 드래그 시 카드 순서 꼬임 | Decimal sortOrder + version OCC + 재정렬 작업 |
| 승인 동시 처리 | 중복 승인/역할 불일치 | DB transaction, status 조건부 update, AuditLog |
| Mock과 DB 이중 진실 | 화면마다 다른 데이터 | 도메인 전환 완료 시 해당 Mock import 제거를 완료 조건으로 둠 |
| Prisma 7 설정 차이 | 초기 설치/빌드 실패 | ESM generator, driver adapter, explicit seed 설정을 기준으로 검증 |

## 11. 검증 체크리스트

### 11.1 Schema

- [ ] `prisma format` 통과
- [ ] `prisma validate` 통과
- [ ] 빈 PostgreSQL에 전체 migration 적용 가능
- [ ] 모든 업무 모델에 organization 범위가 존재
- [ ] 모든 FK의 삭제 정책이 의도와 일치
- [ ] Unique/Index 이름과 순서 검토
- [ ] UTC `timestamptz` 사용 확인
- [ ] 민감정보가 AuditLog에 기록되지 않음

### 11.2 Seed

- [ ] `prisma db seed` 2회 실행 시 중복 없음
- [ ] 6개 역할/상태 계정 로그인 가능
- [ ] 테스트 조직, 프로젝트 4개, 업무 8개 생성
- [ ] 문서 트리와 최초 버전 생성
- [ ] 채널과 메시지 시간순 생성
- [ ] 파일 메타데이터와 프로젝트 연결 정상
- [ ] Production 환경에서 Seed 차단

### 11.3 Authentication

- [ ] 이메일 로그인 성공/실패
- [ ] 비밀번호 해시만 저장
- [ ] Access Token 만료 후 Refresh 성공
- [ ] Refresh Token 재사용 감지
- [ ] 로그아웃 후 세션 폐기
- [ ] pending Membership 업무 API 차단
- [ ] 승인 후 active 전환
- [ ] 일반 Member의 Admin API 403
- [ ] 조직 전환 시 JWT와 Membership 일치

### 11.4 Tenant Isolation

- [ ] 조직 A 사용자가 조직 B 프로젝트 조회 불가
- [ ] 직접 UUID 추측으로 문서/파일/메시지 접근 불가
- [ ] Admin도 소속 조직 외 데이터 접근 불가
- [ ] SUPER_ADMIN 접근은 별도 정책과 AuditLog 적용
- [ ] 목록/검색/집계 모두 organizationId 조건 포함

### 11.5 Domain Integration

- [ ] 프로젝트 칸반 Mock 배열 제거
- [ ] 문서 트리와 Tiptap JSON round-trip
- [ ] 채팅 cursor pagination과 unread 계산
- [ ] 파일 presigned upload/complete/download 흐름
- [ ] 알림 dedupe 동작
- [ ] 관리자 핵심 통계가 Seed 원본과 일치
- [ ] API 오류 시 Mock fallback 없이 Error UI 표시

### 11.6 Performance

- [ ] 프로젝트 목록 p95 300ms 이하
- [ ] Task 칸반 조회 p95 400ms 이하
- [ ] 문서 상세 p95 400ms 이하
- [ ] 채팅 메시지 50개 조회 p95 300ms 이하
- [ ] 파일 목록 p95 400ms 이하
- [ ] 관리자 Dashboard p95 800ms 이하 또는 캐시 적용
- [ ] 주요 Query에 `EXPLAIN ANALYZE` 검토
- [ ] N+1 query 탐지

### 11.7 Migration/Operations

- [ ] Staging 백업과 복구 테스트
- [ ] Migration 실패 시 배포 중단
- [ ] Migration과 App 배포의 backward compatibility 확인
- [ ] DB connection pool 한도 설정
- [ ] slow query/오류/세션 이상 모니터링
- [ ] PITR와 일일 snapshot 정책 확인
- [ ] 롤백 또는 forward-fix runbook 작성

### 11.8 UI Regression

- [ ] Login/Register/Pending 화면 동일
- [ ] Dashboard 데이터 로딩/Empty/Error/Skeleton
- [ ] Project, Document, Chat, File, Admin 레이아웃 유지
- [ ] 1440/768/390 반응형 유지
- [ ] 콘솔 오류 0개
- [ ] 생산 빌드 통과

## 12. 단계별 완료 기준

### Gate A: Identity Ready

- User/Organization/Membership/Session migration 완료
- Auth API와 승인 플로우 통합 테스트 통과
- Mock Auth 제거 가능

### Gate B: Collaboration Core Ready

- Project/Task/Document/Chat/File API가 Seed Data를 반환
- 주요 UI에서 컴포넌트 내부 Mock 배열 제거
- 조직 격리 테스트 통과

### Gate C: Operations Ready

- Notification/AuditLog 연결
- 관리자 Core 통계 연결
- 성능 목표와 DB 운영 체크리스트 통과

### Gate D: Mock Removal

- 운영 빌드에서 Mock 데이터 import 0건
- `localStorage` Mock 키 제거
- Mock fallback 코드 0건
- 실제 API 실패가 Error/Empty 상태로 표현됨

## 13. 구현 권장 순서

1. Prisma/PostgreSQL 기반 설정과 Identity migration
2. Seed 사용자·조직 생성
3. NestJS Auth와 Membership 승인
4. Next.js AuthProvider HTTP 전환
5. Project/Task migration과 칸반 연결
6. Document migration과 에디터 연결
7. Chat migration과 Socket 연결
8. FileAsset migration과 S3 연결
9. Notification/AuditLog 연결
10. Admin Core 통계 연결
11. 현장/결재 확장 모델 추가
12. Mock 제거와 전체 회귀 검증

## 14. 공식 참고 기준

- [Prisma ORM PostgreSQL Quickstart](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql): Prisma ORM 7의 ESM-first `prisma-client`, generated output, driver adapter 구성을 기준으로 한다.
- [Prisma Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding): `prisma.config.ts` seed command와 명시적 `prisma db seed`를 기준으로 한다.
- [Prisma Migrate 개발/운영 워크플로](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production): 개발은 `migrate dev`, 테스트/운영은 `migrate deploy`를 사용한다.
- [Prisma Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)와 [Indexes](https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes): 명시적 관계 모델과 복합 Unique/Index를 사용한다.
- [Prisma Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions): `version` 필드 기반 optimistic concurrency control과 원자적 승인 처리를 적용한다.

## 15. 최종 결론

첫 DB 연결은 Auth와 조직 Membership만 대상으로 작게 시작한다. 이후 Project → Document → Chat → File 순서로 도메인을 전환하고, 각 도메인의 API 검증과 UI 회귀가 끝난 뒤 해당 Mock만 제거한다. 관리자 통계는 Core 테이블의 원본 데이터에서 계산하며 현장 방문, 속도측정, 장애, AI, 전자결재는 후속 확장 모델이 준비된 뒤 완전 연결한다.

이 문서 작성 단계에서는 실제 DB, Prisma 파일, API, UI 코드를 변경하지 않는다.
