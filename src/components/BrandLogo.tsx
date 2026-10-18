import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeDimensions = {
  sm: { imgSize: 28, titleSize: "1rem", subtitleSize: "0.7rem" },
  md: { imgSize: 38, titleSize: "1.25rem", subtitleSize: "0.75rem" },
  lg: { imgSize: 52, titleSize: "1.75rem", subtitleSize: "0.85rem" },
};

export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const currentSize = sizeDimensions[size];

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        userSelect: "none",
      }}
    >
      <picture style={{ display: "inline-flex", alignItems: "center" }}>
        {/* En modo oscuro carga logo-dark; por defecto logo-light */}
        <source media="(prefers-color-scheme: dark)" srcSet={logoDark} />
        <img
          src={logoLight}
          alt="Cuaderno Logo"
          width={currentSize.imgSize}
          height={currentSize.imgSize}
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))",
          }}
        />
      </picture>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: currentSize.titleSize,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "var(--text-primary)",
            }}
          >
            Cuaderno
          </span>
          <span
            style={{
              fontSize: currentSize.subtitleSize,
              color: "var(--text-secondary)",
              lineHeight: 1.2,
            }}
          >
            Gestor de tareas
          </span>
        </div>
      )}
    </div>
  );
}
