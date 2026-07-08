# Changelog

All notable changes to FrontierAtlas will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

### [0.16.2](https://github.com/htlost/frontieratlas/compare/v0.16.1...v0.16.2) (2026-07-08)


### Bug Fixes

* **android:** network timeout + MapLibre IndexOutOfBoundsException ([f930b0e](https://github.com/htlost/frontieratlas/commit/f930b0e03d5c5adf3ff3dcb19fc845c56e1a3819))
* cross-platform network timeout + GeoJSON sanitization ([5d053c1](https://github.com/htlost/frontieratlas/commit/5d053c1a9c75b4c010a93842db0179ab3c16d786))
* deduplicate consecutive polygon coordinates to prevent MapLibre Native crash ([ade4ef6](https://github.com/htlost/frontieratlas/commit/ade4ef62f3142bb24f5826ec7dee2583ff50a56f))


### Documentation

* add coordinate dedup release log ([9041346](https://github.com/htlost/frontieratlas/commit/904134688649571df03e6268be11cfa03b57f14e))
* add v0.16.1 release log ([66e8cee](https://github.com/htlost/frontieratlas/commit/66e8cee2f5aaf9b402217fc250cb989b4e16370f))

### [0.16.1](https://github.com/htlost/frontieratlas/compare/v0.16.0...v0.16.1) (2026-07-08)


### Bug Fixes

* switch REMOTE_BASE_URL from broken R2 direct URL to Worker proxy ([0eca574](https://github.com/htlost/frontieratlas/commit/0eca574f27014c890c2196830806546124b2b134))


### Documentation

* add implementation, review, and testing logs for R2 proxy fix and lint fixes ([a41cf93](https://github.com/htlost/frontieratlas/commit/a41cf93d6bd582fa2ec5132d1cb0b5d33fff094b))

## [0.16.0](https://github.com/htlost/frontieratlas/compare/v0.15.6...v0.16.0) (2026-07-07)


### Features

* **infra:** setup Cloudflare R2 + Workers for GeoJSON distribution ([3fe1374](https://github.com/htlost/frontieratlas/commit/3fe1374d58119160f4618410c0f78a16dce39434))
* **quota:** add free-tier quota tracking and graceful degradation ([ee65b5d](https://github.com/htlost/frontieratlas/commit/ee65b5d24ee817c36e471350a4e81fd2fe6a1dcf))
