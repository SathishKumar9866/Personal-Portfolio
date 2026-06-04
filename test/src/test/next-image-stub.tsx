// Stub for next/image in Vitest - renders a plain <img> so static-import dimensions
// (absent under Vite) don't trip next/image's required-prop checks.
import * as React from "react";

type AnyProps = Record<string, unknown>;

const NextImageStub = ({ src, alt, ...rest }: AnyProps) => {
  const resolved =
    typeof src === "object" && src !== null && "src" in src
      ? (src as { src: string }).src
      : (src as string);
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return (
    <img src={resolved} alt={(alt as string) ?? ""} {...(rest as AnyProps)} />
  );
};

export default NextImageStub;
