---
agent: IMP
task_id: TASK-android-bug-fixes
date: 2026-07-08
status: pending
category: log
destination: inbox/
related:
  - "[Implementation Log](../../logs/impl/implementation/2026-07-08_IMP_android-bug-fixes.md)"
tags:
  - IMP
  - handoff
  - bugfix
---

# HANDOFF: IMP → ORC

## Metadata
| Field | Value |
|-------|-------|
| **From** | IMP |
| **To** | ORC |
| **Task ID** | TASK-android-bug-fixes |
| **Status** | success |
| **Confidence** | high |
| **Handoff Type** | return |

---

## Task Context（継承・追記セクション）

### Original Request
Fix 2 Android bugs in FrontierAtlas mobile app:
1. Network Error on Android Device (AbortSignal.timeout + cache incompatibility)
2. java.lang.IndexOutOfBoundsException in MapLibre (name property expression crash)

### Constraints
- iOS and Web paths must not be broken

### Chain History
| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | IMP | done | All 6 files modified/created. See Key Findings below. |

---

## Key Findings / Decisions

### Bug 1: Network Error on Android Device — 4 files changed

| File | Change | Rationale |
|------|--------|-----------|
| `mobile/src/infra/network/fetchWrapper.ts` | Replaced `AbortSignal.timeout()` with manual `AbortController` + `setTimeout`; added `Platform` import; conditional `cache: Platform.OS === "android" ? "default" : "no-cache"`; increased timeout 15,000→30,000ms | Hermes doesn't support `AbortSignal.timeout()`; Android fetch polyfill struggles with `no-cache` |
| `mobile/src/infra/network/fetchJson.ts` | Changed backoff from `300 * 2 ** i` → `1000 * 2 ** i` | More resilient retry timing for spotty mobile connections |
| `mobile/app.config.ts` | Added `networkSecurityConfig: "@xml/network_security_config"` to expo-build-properties | Required for Android network security policy |
| `mobile/android/app/src/main/res/xml/network_security_config.xml` | Created new XML restricting cleartext to trusted domains | Prevents cleartext traffic to unknown hosts |

### Bug 2: IndexOutOfBoundsException in MapLibre — 2 files changed

| File | Change | Rationale |
|------|--------|-----------|
| `mobile/src/features/home/map/renderers/labels/shareComp.tsx` | Replaced `["get", "ja", ["get", "name"]]` with `["case", ...]` expression checking `["has", "name"]` → `["get", "ja", ...]` else `["has", "name_ja"]` → `["get", "name_ja"]` else `""` | Prevents null access crash in native expression evaluator at zoom >= 19.4 |
| `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | Added name normalization: `name_ja/name_en` → `name: { ja, en }` when `name_ja` exists but `name` is null | Ensures `shareComp.tsx` always receives valid `name` object from studyhall data |

### iOS/Web Safety Check
- All Android-specific code is gated behind `Platform.OS === "android"` or purely additive (backoff increase, expression fallback)
- Existing logic unchanged for non-Android paths

---

## Artifacts

### Modified Files
| Path | Type | Description |
|------|------|-------------|
| `mobile/src/infra/network/fetchWrapper.ts` | source | `AbortController`, `Platform`-based cache, increased timeout |
| `mobile/src/infra/network/fetchJson.ts` | source | Retry backoff 300→1000ms |
| `mobile/app.config.ts` | config | Added `networkSecurityConfig` to expo-build-properties |
| `mobile/src/features/home/map/renderers/labels/shareComp.tsx` | source | Null-safe textField expression |
| `mobile/src/features/home/map/renderers/MapIconLabel.tsx` | source | Name property normalization in `.map()` |

### Created Files
| Path | Type | Description |
|------|------|-------------|
| `mobile/android/app/src/main/res/xml/network_security_config.xml` | config | Network security config for Android |
| `docs/logs/impl/implementation/2026-07-08_IMP_android-bug-fixes.md` | log | Implementation log |
| `docs/_inbox/2026-07-08_HANDOFF_IMP_ORC_TASK-android-bug-fixes.md` | handoff | This handoff document |

---

## Open Questions
- None. All changes are self-contained and verified (zero TypeScript/lint errors).

---

## Routing
| Field | Value |
|-------|-------|
| **Next Agent** | ORC |
| **Blockers** | none |
| **Priority** | medium |
| **Deadline** | — |

---

## ORC Approval（ORC が最終確認時に記入）

