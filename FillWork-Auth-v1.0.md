# FillWork Authentication v1.0

## Overview

- Status: Phase 2 Mock Authentication complete
- Date: 2026-06-13
- Runtime: Next.js 15 App Router, React Context, browser localStorage
- Database: Not connected
- Token: Mock JWT-style token
- Design: Existing FillWork dark workspace system

Authentication v1.0 converts the Phase 1 UI demo into a persistent, role-aware application flow without introducing a real database or external identity provider. The implementation boundary is intentionally isolated so the Mock API can later be replaced by NestJS endpoints.

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/login` | Email and Google mock login | Public |
| `/register` | Organization membership request | Public |
| `/forgot-password` | Password reset request | Public |
| `/auth/pending` | Administrator approval wait | Pending user |
| `/` | Dashboard | Active user |
| `/projects` | Project workspace | Active user |
| `/documents` | Document workspace | Active user |
| `/chat` | Chat workspace | Active user |
| `/files` | File workspace | Active user |
| `/admin` | Administration center and approvals | `SUPER_ADMIN`, `ORG_ADMIN` |

## Authentication Features

### Email Login

- Email and password validation through `mockAuthApi.login`
- Persistent session restored through `mockAuthApi.getMe`
- Suspended account rejection
- Pending account routing to `/auth/pending`
- Role-based post-login destination

### Google Login

- Production-ready Google button UI
- Mock login returns the seeded Member account
- No external OAuth request is made in v1.0

### Registration

- Name, work email, password, organization and optional invitation code
- Required terms agreement
- Minimum eight-character password validation
- Newly registered accounts always begin in `pending`
- Registration session persists and opens the approval wait page

### Password Reset

- Account-enumeration-safe success message
- Mock asynchronous request state
- No email is transmitted in v1.0

### Logout

- Shared profile menu across Dashboard, Project, Document, Chat, File and Admin
- Current browser session removal
- Immediate return to `/login`

## Mock Auth API

Location: `lib/mock-auth-api.ts`

```text
login(input)
googleLogin()
register(input)
logout()
forgotPassword(email)
getMe()
listPending()
approve(userId, role)
```

Data is stored under versioned browser keys:

```text
fillwork.mock.users.v1
fillwork.mock.session.v1
```

The token has a JWT-like three-part shape but is not cryptographically signed. It must never be used as a production authentication mechanism.

## Demo Accounts

Mock mode accepts any local test password with 8 or more characters. Database mode uses the password configured through the local seed environment.

| Role | Email | Default route |
|---|---|---|
| `SUPER_ADMIN` | `super@fillwork.kr` | `/admin` |
| `ORG_ADMIN` | `admin@fillwork.kr` | `/admin` |
| `MANAGER` | `manager@fillwork.kr` | `/` |
| `MEMBER` | `member@fillwork.kr` | `/` |
| `GUEST` | `guest@fillwork.kr` | `/` |
| Pending member | `pending@fillwork.kr` | `/auth/pending` |

## Role Routing

| Role | Core workspace | Admin center |
|---|:---:|:---:|
| `SUPER_ADMIN` | Yes | Yes |
| `ORG_ADMIN` | Yes | Yes |
| `MANAGER` | Yes | No |
| `MEMBER` | Yes | No |
| `GUEST` | Yes | No |

Inactive membership status takes precedence over role. A pending user cannot enter any protected workspace even if a privileged role value is present.

## Approval Flow

1. User registers and receives a pending Mock session.
2. The route guard sends the user to `/auth/pending`.
3. An organization administrator logs into `/admin`.
4. The administrator selects a role and approves the request.
5. The user signs in again or selects approval status refresh.
6. The refreshed active membership opens the appropriate role home.

The Admin dashboard approval card is backed by the same versioned Mock user store as registration and login.

## State Architecture

- `AuthProvider` owns the current user and initial session restore state.
- `AuthRouteGuard` applies public, pending, protected and Admin policies.
- `AuthProfileButton` exposes role, organization and logout across existing UI surfaces.
- Authentication loading uses a dedicated branded splash to prevent protected UI flashes.
- Context was selected instead of adding Zustand solely for one global authentication domain.

## Responsive Behavior

- 1440px: full split-screen brand and authentication workspace
- 768px: compact split screen with reduced preview density
- 390px: single-column form, mobile brand header and touch-sized controls
- No horizontal overflow at the three required viewports
- Login content fits the requested viewport heights without page scrolling

## Accessibility

- Explicit labels and accessible names for all form controls
- Keyboard-operable buttons, links, checkbox and profile menu
- Visible focus treatment through `:focus-within`
- Error message uses `role="alert"`
- Form autocomplete metadata is provided
- Reduced-motion behavior inherits the global FillWork rule

## Verification

- TypeScript `tsc --noEmit`: passed
- Next.js production build: passed
- Browser console errors: 0
- Responsive overflow checks: passed at 1440x900, 768x900 and 390x844
- Email login: passed
- Pending account redirect: passed
- Registration to pending: passed
- Administrator approval: passed
- Member Admin-route rejection: passed
- Session logout: passed

## Artifacts

- `output/playwright/FillWork-Auth-before.png`
- `output/playwright/FillWork-Auth-Login-v1.0.png`
- `output/playwright/FillWork-Auth-Register-v1.0.png`
- `output/playwright/FillWork-Auth-Login-768.png`
- `output/playwright/FillWork-Auth-Login-390.png`
- `output/playwright/FillWork-Auth-v1.0-before-after.png`

## Production Transition

The next backend phase should replace `mockAuthApi` with NestJS HTTP calls while preserving the public method contract used by `AuthProvider`. Refresh tokens should move to secure HttpOnly cookies, users and memberships to PostgreSQL, and Google login to verified OAuth 2.0/OIDC. Route authorization must also be enforced server-side; the current client guard is presentation-layer protection only.
