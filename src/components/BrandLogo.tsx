import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizePixels = {
  sm: 28,
  md: 38,
  lg: 52,
} as const;

export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const imgSize = sizePixels[size];

  return (
    <div
      className={`brand-logo-container brand-logo-${size} ${className}`.trim()}
    >
      <picture className="brand-logo-picture">
        <source media="(prefers-color-scheme: dark)" srcSet={logoDark} />
        <img
          src={logoLight}
          alt="Cuaderno Logo"
          width={imgSize}
          height={imgSize}
          className="brand-logo-img"
        />
      </picture>

      {showText && (
        <div className="brand-logo-text">
          <span className="brand-logo-title">Cuaderno</span>
        </div>
      )}
    </div>
  );
}
