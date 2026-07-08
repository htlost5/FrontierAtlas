---
agent: IMP
task_id: TASK-android-revert
date: 2026-07-08
status: approved
category: log
destination: logs/impl/implementation/
related:
  - "[HANDOFF_IMP_DEV_android-redesign](../../_inbox/2026-07-08_HANDOFF_IMP_DEV_android-redesign.md)"
tags:
  - IMP
  - revert
  - android
  - cross-platform
---

# Implementation Log — Android-Specific Revert

## Summary

Reverted all Android-specific workarounds from the codebase, restoring a pure cross-platform Expo React Native implementation. No Android-specific XML files existed on disk — only app.config.ts references were removed.

## Changes Made

### 1. `mobile/src/infra/network/fetchWrapper.ts`
- **Removed**: `Platform` import from `react-native`
- **Removed**: Manual `AbortController` + `setTimeout` pattern
- **Removed**: `Platform.OS === "android"` cache switching
- **Restored**: `AbortSignal.timeout(15000)` — standard API
- **Restored**: `cache: "no-cache"` for all platforms
- **Restored**: timeout from 30000ms → 15000ms

### 2. `mobile/src/infra/network/fetchJson.ts`
- **Changed**: Retry backoff delay from `1000 * 2 ** i` → `300 * 2 ** i`

### 3. `mobile/app.config.ts`
- **Removed**: `networkSecurityConfig: "@xml/network_security_config"` from `expo-build-properties` Android config

### 4. `mobile/android/app/src/main/res/xml/network_security_config.xml`
- **No action**: File does not exist on disk (was referenced in docs but never created)

## Files Kept Unchanged (cross-platform fixes)
- `tools/map-assets/transformer/transform.js`
- `mobile/src/features/home/map/renderers/labels/shareComp.tsx`
- `mobile/src/features/home/map/renderers/MapIconLabel.tsx`
- `mobile/src/data/urls.ts`

## Verification
- `fetchWrapper.ts` — ✅ No errors, clean pure implementation
- `fetchJson.ts` — ✅ No errors, backoff restored to 300ms
- `app.config.ts` — ✅ No errors, networkSecurityConfig removed

## Next Steps
Handoff to DEV for redesign of cross-platform fixes without Android-specific workarounds.
