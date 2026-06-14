# FillWork Document Workspace v1.0

## Overview

- Route: `/documents`
- Phase: Phase 1 UI prototype
- Data: Mock Data only
- Target: Desktop-first document workspace
- Visual ratio: Notion 60%, FillWork field operations 30%, Toss 10%

## Experience Goals

The workspace combines a low-density Notion-style editor with FillWork-specific field evidence. The global navigation, dark color system, mode switch, border treatment, and interaction language follow Dashboard v1.0 and Project Kanban v1.0.

## Layout

- Global sidebar: 195px
- Page tree: 220px
- Editor: fluid, minimum 520px
- AI document assistant: 300px
- Global header: 53px
- Document action bar: 45px
- Desktop app frame: 1400 x 900 at the 1536 x 1024 review viewport

The application shell remains fixed. The document editor scrolls independently so navigation, the page tree, and AI assistance remain available while reading a long document.

## Included UI

### Page Tree

- Favorites
- Personal documents
- Team documents
- Recent documents
- Nested pages, active state, page search, and new-page affordance

### Editor

- Cover and document icon
- Title, author, update time, and reading time
- Body copy and divider
- Checklist
- Notion-style table
- Code block
- Quote
- Collapsible toggle preview
- Image-based field evidence block

### Action Bar

- Share
- Comments
- Version history
- AI writing
- Favorite

### AI Document Assistant

- Document completeness score
- Meeting summary
- Notice draft
- Document improvement suggestions
- Contextual safety and image-description suggestions
- Mock prompt input

### FillWork Field Operations

- Field photo attachment action
- Before/after work photo comparison
- Network speed measurement result
- Customer confirmation signature status

## Responsive Behavior

- Desktop: four-column workspace with persistent AI panel
- Tablet: AI panel is removed first and the editor retains priority
- Small tablet: global sidebar is removed and the page tree remains available
- Mobile: editor becomes the primary surface; secondary navigation is hidden behind the mobile affordance

## Interaction Specification

- Buttons and list items use 180ms hover transitions
- Active tree and navigation items use FillWork blue-tinted selection states
- Cards lift subtly or increase border contrast on hover
- Buttons are intentionally inert in Phase 1
- No authentication, persistence, upload, editor engine, AI API, or realtime behavior is connected

## Visual QA

- Review viewport: 1536 x 1024
- Responsive checks: 1440 x 900, 768 x 900, and 390 x 844
- Page overflow: none
- Editor overflow: independent vertical scroll, expected
- Tablet: AI panel hidden, page tree retained
- Mobile: sidebar, page tree, and AI panel hidden; editor promoted to the primary surface
- Browser console warnings/errors: 0
- Required regions present: global navigation, page tree, editor, AI assistant, and field evidence
- Production build: passed

## Artifacts

- `output/playwright/FillWork-Document-before.png`
- `output/playwright/FillWork-Document-v1.0.png`
- `output/playwright/FillWork-Document-v1.0-before-after.png`
- `output/playwright/FillWork-Document-v1.0-diff.png`
- `output/playwright/FillWork-Document-v1.0-verdict.json`
