# FillWork File Manager v1.0

## Overview

- Route: `/files`
- Phase: Phase 1 UI prototype
- Data: Mock Data only
- Target: Desktop-first field file management
- Visual ratio: Google Drive 50%, Dropbox 20%, Notion 10%, FillWork field operations 20%

## Product Direction

FillWork File Manager combines Google Drive's familiar file navigation, Dropbox's clear synchronization feedback, and Notion's lightweight metadata. Field evidence is organized by site, work stage, measurement type, and customer confirmation instead of relying only on generic folders.

## Desktop Layout

- Global sidebar: 195px
- Folder tree: 205px
- Main file area: fluid, minimum 580px
- Detail panel: 285px
- Global header: 53px
- Application frame: 1400 x 900 at the 1536 x 1024 review viewport

## Included UI

### Folder Tree

- 전체 파일
- 최근 파일
- 즐겨찾기
- 공유 파일
- 휴지통
- 현장 폴더
- 업무 유형 folders
- AI organization progress

### Main File Area

- Search
- Sort
- Filter
- Grid/List view switch
- File upload action
- Field folder cards
- File grid with selected state
- Compact list view with owner, modified date, and size

### Detail Panel

- Large image preview
- Before/after comparison shortcut
- AI-generated tags and confidence
- Uploader, time, location, and linked project
- Activity history
- Share and download actions

### FillWork Field Features

- Automatic classification by worksite
- Before/after photo pairing
- Speed-test result storage
- Customer signature storage
- AI tag generation
- Work type and site metadata

## Responsive Behavior

- Desktop 1440px: full four-panel workspace and four-column file grid
- Tablet 768px: compact global sidebar, folder tree retained, detail panel hidden, three-column grid
- Mobile 390px: content-first layout, secondary navigation hidden, two-column grid
- Horizontal page overflow: none at all tested widths

## Interaction Notes

- Hover feedback is included for folders, files, rows, filters, upload controls, and detail actions.
- Search, sorting, filtering, view switching, upload, sharing, download, AI classification, and persistence are intentionally inactive in Phase 1.
- No S3, CloudFront, API, permission, upload, or versioning connection is included.

## Visual QA

- Review viewport: 1536 x 1024
- Responsive checks: 1440 x 900, 768 x 900, 390 x 844
- Browser console warnings/errors: 0
- Production build: passed
- Visual verdict: 95 / 100

## Artifacts

- `output/playwright/FillWork-File-before.png`
- `output/playwright/FillWork-File-v1.0.png`
- `output/playwright/FillWork-File-v1.0-before-after.png`
- `output/playwright/FillWork-File-v1.0-diff.png`
- `output/playwright/FillWork-File-v1.0-verdict.json`

