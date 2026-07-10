---
agent: IMP
task_id: TASK-android-revert
date: 2026-07-08
status: draft
category: shared
destination: shared/impl/handoff/
related:
  - "[Implementation Log](../logs/impl/implementation/2026-07-08_IMP_android-bug-fixes.md)"
  - "[Implementation Revert Log](../logs/impl/implementation/2026-07-08_IMP_android-revert.md)"
tags:
  - IMP
  - DEV
  - handoff
  - android
  - redesign
---

# HANDOFF: IMP → DEV

## Status
✅ Success — Android-specific code reverted. Ready for cross-platform redesign.

## Task Context (inherited)

### Problem
Android-specific workarounds were introduced to fix:
1. **`fetchWrapper.ts`**: `AbortSignal.timeout()` reportedly unsupported on Hermes Android; fetch polyfill cache mode differences
2. **`fetchJson.ts`**: Retry backoff increased from 300ms to 1000ms (performance concern)
3. **`app.config.ts`**: `networkSecurityConfig` added for cleartext traffic restriction

### Revert Summary
All three items above have been reverted to the original pure cross-platform implementation. See implementation revert log for details.

## Key Findings / Decisions

| Item | Status | Notes |
|------|--------|-------|
| `fetchWrapper.ts` Platform import + manual AbortController | ✅ **Removed** | Restored `AbortSignal.timeout(15000)` + `cache: "no-cache"` |
| `fetchJson.ts` 1000ms backoff | ✅ **Restored to 300ms** | `300 * 2 ** i` |
| `app.config.ts` networkSecurityConfig | ✅ **Removed** | No XML file existed on disk |

## Open Questions — For DEV to resolve

1. **`AbortSignal.timeout()` on Hermes Android**: Does the current Hermes version (0.7x+) actually support `AbortSignal.timeout()`? If not, is there a true cross-platform polyfill approach that doesn't require `Platform.OS` branching?
2. **Fetch cache mode on Android polyfill**: Does the Android fetch polyfill truly behave differently with `"no-cache"`? Can we use a different strategy (e.g., `Cache-Control` headers) instead?
3. **Network security**: Is `networkSecurityConfig` actually needed for production, or can we rely on HTTPS-only URLs from the Worker proxy?

## Artifacts
- Reverted files:
  - `mobile/src/infra/network/fetchWrapper.ts`
  - `mobile/src/infra/network/fetchJson.ts`
  - `mobile/app.config.ts`
- Implementation revert log: `docs/logs/impl/implementation/2026-07-08_IMP_android-revert.md`
- Previous Android bug fix log: `docs/logs/impl/implementation/2026-07-08_IMP_android-bug-fixes.md`

## Routing
**Handing off to**: DEV (DevPlanner)
**Action requested**: Design cross-platform solutions for the original Android issues without platform-specific branching
