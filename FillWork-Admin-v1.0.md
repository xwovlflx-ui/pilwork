# FillWork Admin v1.0

## Overview

- Route: `/admin`
- Phase: Phase 1 UI prototype
- Data: Mock Data only
- Target: Desktop-first executive and administrator center
- Visual ratio: Toss Admin 40%, Notion Admin 20%, Jira Admin 20%, FillWork field operations 20%

## Product Direction

FillWork Admin is designed so a representative can understand the company's operating condition from one screen. Toss-inspired KPI clarity is combined with Notion-style calm hierarchy, Jira-style operational depth, and FillWork-specific field intelligence.

## Desktop Layout

- Global sidebar: 195px
- Admin navigation rail: 185px
- Management dashboard: fluid, minimum 620px
- Field insight rail: 295px
- Global header: 53px
- Application frame: 1400 x 900 at the 1536 x 1024 review viewport

## Included UI

### Administrator Dashboard

- Today's visits
- Incomplete tasks
- Active employees
- Photo uploads
- Pending approvals
- Urgent issues
- Overall operating-health signal

### Employee Management

- Employee list
- Working/off status
- Latest activity
- Team and role assignment controls

### Organization Management

- Department summary
- Team and headcount information
- Department progress
- Permission-policy summary

### Statistics

- Weekly task throughput
- Project progress
- Employee activity and productivity context
- AI usage and usage composition

### FillWork Field Intelligence

- Field technician locations
- Speed-test aggregation
- Photo-upload ranking
- Unresolved incident status
- Field-focused executive insight rail

## Responsive Behavior

- Desktop 1440px: complete four-panel administrator workspace
- Tablet 768px: compact global sidebar and admin rail retained; field insight rail hidden
- Mobile 390px: KPI and management-content layout; secondary navigation hidden
- Horizontal page overflow: none at all tested widths

## Interaction Notes

- Hover feedback is included for KPI cards, navigation, employee rows, issues, and management controls.
- Date filtering, employee changes, permissions, organization edits, chart filtering, and issue handling are intentionally inactive in Phase 1.
- No authentication, role enforcement, analytics API, location tracking, approval, billing, or audit-log connection is included.

## Visual QA

- Review viewport: 1536 x 1024
- Responsive checks: 1440 x 900, 768 x 900, 390 x 844
- Browser console warnings/errors: 0
- Production build: passed
- Visual verdict: 96 / 100

## Artifacts

- `output/playwright/FillWork-Admin-before.png`
- `output/playwright/FillWork-Admin-v1.0.png`
- `output/playwright/FillWork-Admin-v1.0-before-after.png`
- `output/playwright/FillWork-Admin-v1.0-diff.png`
- `output/playwright/FillWork-Admin-v1.0-verdict.json`

