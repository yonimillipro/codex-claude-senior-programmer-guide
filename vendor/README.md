# Pinned browser dependencies

Self-hosted to avoid runtime CDN requests; no package installation or build step.

- Three.js **0.186.1**: `three.module.min.js` and its `three.core.js` import
  (the minified core distribution, named to match the module's upstream import).
  [Upstream](https://github.com/mrdoob/three.js) · MIT license in `THREE-LICENSE.txt`.
- GSAP **3.15.0**: `gsap.min.js`.
  Copyright 2026 GreenSock. Distributed under the
  [GSAP standard license](https://gsap.com/standard-license/), **not MIT**.
  The upstream license notice is preserved at the top of the file.

Downloaded from the version-pinned npm distributions on jsDelivr. Keep these
versions and notices together when updating; check upstream license terms.
