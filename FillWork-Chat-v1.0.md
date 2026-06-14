# FillWork Chat v1.0

## Overview

- Route: `/chat`
- Phase: Phase 1 UI prototype
- Data: Mock Data only
- Target: Desktop-first field collaboration chat
- Visual ratio: Slack 50%, KakaoTalk 30%, Discord 20%

## Product Direction

FillWork Chat keeps Slack's channel hierarchy, adds KakaoTalk-inspired conversational softness, and uses Discord-style persistent channel context. Field operations are embedded directly in the message timeline instead of being separated into secondary tools.

## Desktop Layout

- Global sidebar: 195px
- Channel rail: 225px
- Conversation: fluid, minimum 500px
- Context panel: 280px
- Global header: 53px
- Channel header: 57px
- Application frame: 1400 x 900 at the 1536 x 1024 review viewport

The message list scrolls independently. The composer, global navigation, channel list, and context panel remain available during long conversations.

## Included UI

### Channels

- 전체 공지
- 현장지원
- 기술문의
- 자유채팅
- Project channels
- Direct messages and online indicators
- Unread badges and active channel state

### Conversation

- User messages and role metadata
- Read status
- Date and unread dividers
- Emoji reactions
- File attachment card
- Shared location card
- Image attachment gallery
- Persistent composer with attachment tools

### Context Panel

- Participants
- Shared files
- Pinned messages
- Channel response health

### FillWork Field Features

- Emergency call action
- AI field-photo classification
- Current location sharing
- Voice memo waveform
- AI voice-to-text transcript

## Responsive Behavior

- Desktop 1440px: full four-panel workspace
- Tablet 768px: compact global sidebar, channel rail retained, context panel hidden
- Mobile 390px: conversation-first layout; global sidebar, channel rail, and context panel hidden
- Horizontal page overflow: none at all tested widths

## Interaction Notes

- Hover feedback is provided for channels, messages, reactions, files, participants, and action buttons.
- Emergency calling, message sending, uploads, location access, recording, AI processing, and persistence are intentionally inactive in Phase 1.
- No WebSocket, API, authentication, storage, or notification connection is included.

## Visual QA

- Review viewport: 1536 x 1024
- Responsive checks: 1440 x 900, 768 x 900, 390 x 844
- Browser console warnings/errors: 0
- Production build: passed
- Visual verdict: 95 / 100

## Artifacts

- `output/playwright/FillWork-Chat-before.png`
- `output/playwright/FillWork-Chat-v1.0.png`
- `output/playwright/FillWork-Chat-v1.0-before-after.png`
- `output/playwright/FillWork-Chat-v1.0-diff.png`
- `output/playwright/FillWork-Chat-v1.0-verdict.json`

