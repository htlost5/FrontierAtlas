---
agent: IMP
task_id: TASK-android-bug-fixes
date: 2026-07-08
status: completed
category: log
destination: logs/impl/implementation/
related:
  - "[fetchWrapper.ts](../../../../mobile/src/infra/network/fetchWrapper.ts)"
  - "[fetchJson.ts](../../../../mobile/src/infra/network/fetchJson.ts)"
  - "[app.config.ts](../../../../mobile/app.config.ts)"
  - "[shareComp.tsx](../../../../mobile/src/features/home/map/renderers/labels/shareComp.tsx)"
  - "[MapIconLabel.tsx](../../../../mobile/src/features/home/map/renderers/MapIconLabel.tsx)"
  - "[network_security_config.xml](../../../../mobile/android/app/src/main/res/xml/network_security_config.xml)"
tags:
  - IMP
  - bugfix
  - android
  - network
  - maplibre
---

# IMP: Android Bug Fixes (2026-07-08)

## Bug 1: Network Error on Android Device

### Root Cause
- `AbortSignal.timeout()` is not supported by React Native Hermes on Android
- `cache: "no-cache"` causes issues with Android's fetch polyfill

### Changes

#### 1A — `mobile/src/infra/network/fetchWrapper.ts`
- Added `Platform` import from `react-native`
- Replaced `AbortSignal.timeout()` with manual `AbortController` + `setTimeout`
- Increased default timeout from 15,000ms to 30,000ms
- Conditional cache: `"default"` on Android, `"no-cache"` on iOS/Web

#### 1B — `mobile/src/infra/network/fetchJson.ts`
- Increased retry backoff base from 300ms to 1000ms: `1000 * 2 ** i`

#### 1C — `mobile/app.config.ts`
- Added `networkSecurityConfig: "@xml/network_security_config"` to the `expo-build-properties` plugin's Android config

#### 1D — `mobile/android/app/src/main/res/xml/network_security_config.xml`
- Created new XML file with cleartext traffic restrictions for `workers.dev` and `u.expo.dev`

## Bug 2: java.lang.IndexOutOfBoundsException (MapLibre)

### Root Cause
- `["get", "ja", ["get", "name"]]` expression in `shareComp.tsx` tries to access `name.ja`, but studyhall data uses flat `name_ja` property
- When `["get", "name"]` returns null, `["get", "ja", null]` crashes the native expression evaluator at zoom >= 19.4

### Changes

#### 2A — `mobile/src/features/home/map/renderers/labels/shareComp.tsx`
- Replaced single-line textField expression with a `["case"]` expression that:
  1. Checks `["has", "name"]` → gets `["get", "ja", ["get", "name"]]`
  2. Falls back to `["has", "name_ja"]` → gets `["get", "name_ja"]`
  3. Falls back to empty string `""`

#### 2B — `mobile/src/features/home/map/renderers/MapIconLabel.tsx`
- Added property normalization in the `.map((f) => ...)` callback
- When `name_ja` exists but `name` is null, creates `name: { ja, en }` object
- Ensures `shareComp.tsx` expression always receives a valid `name` object

## Bug 3: NullPointerException on onUserLeaveHint() (React Native 0.83.x)

### Root Cause
- `ReactActivityDelegate.onUserLeaveHint()` calls `Objects.requireNonNull(getReactDelegate())`
- `getReactDelegate()` returns `null` when the RN instance hasn't fully initialized
- Crash occurs when the app is backgrounded before RN initialization completes

### Changes

#### 3A — `mobile/android/app/src/main/java/com/htlost/frontieratlas/dev/MainActivity.kt`
- Added `override fun onUserLeaveHint()` with try-catch to silently catch `NullPointerException`
- Prevents crash when `getReactDelegate()` is null during early lifecycle

### Verification
- File passes Kotlin compilation (zero errors)
- Minimal change — only wraps `super.onUserLeaveHint()` in try-catch
- No side effects on iOS (Android-specific fix)

## Verification
- All 6 edited files pass TypeScript/lint/Kotlin checks (zero errors)
- New `network_security_config.xml` created at expected path
- Android paths handled via `Platform.OS` check — iOS/Web paths are unaffected

## Handoff to Reviewer (REV)
See handoff below.
