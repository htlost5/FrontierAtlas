---
agent: TST
task_id: TASK-r2-proxy-url-fix
date: 2026-07-08
status: approved
category: log
destination: logs/impl/testing/
related:
  - "[urls.ts](../../../../mobile/src/data/urls.ts)"
  - "[REV review log](../review/2026-07-08_REV_r2-proxy-url-fix.md)"
tags:
  - TST
  - testing
  - r2-proxy
  - endpoint
---

# Testing Log: R2 proxy URL fix — endpoint reachability verification

## Test Summary

**Verdict: ✅ PASS — All 3 endpoints verified**

---

## Test Results

### 1. LATEST_URL
| Item | Value |
|---|---|
| URL | https://geo-data-push.htlost8.workers.dev/data/meta/latest.json |
| HTTP Status | **200 OK** |
| Content-Type | pplication/json |
| Response Body | {\"version\":\"v0.0.0\",\"srcFolder\":\"/releases/v0.0.0\"} |
| Has ersion field | ✅ yes |
| Has srcFolder field | ✅ yes |
| Valid JSON | ✅ yes |

### 2. Derived version.json (from latest.json → version → releases path)
| Item | Value |
|---|---|
| URL | https://geo-data-push.htlost8.workers.dev/data/releases/v0.0.0/data/version.json |
| HTTP Status | **200 OK** |
| Response Body | {\"version\":\"v0.0.0\",\"manifestSha256\":\"5630968d0b72e5e5fd2aa56d01c9f8424529c84640e4625dfbd13fc680dd9dab\",\"manifestSize\":5526} |
| Valid JSON | ✅ yes |

### 3. Health endpoint
| Item | Value |
|---|---|
| URL | https://geo-data-push.htlost8.workers.dev/health |
| HTTP Status | **200 OK** |
| Response Body | {\"status\":\"ok\"} |
| Expected {\"status\":\"ok\"} | ✅ matches |

---

## Conclusions

All endpoints are reachable and return valid JSON. The Worker proxy is correctly routing /data/ paths, stripping the prefix, and fetching from the R2 bucket (geo-data-frontieratlas). The /health endpoint confirms the Worker is alive and serving requests.

No regressions detected. Ready for release.

## Routing

→ **REL**: All tests passed. Handing off for release.
