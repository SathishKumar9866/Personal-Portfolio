// Stub used by Vitest in place of real .svg imports (which go through @svgr/webpack at build time).
import * as React from "react";

const SvgStub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="svg-stub" {...props} />
);

export default SvgStub;
