import { useContext } from "react";
import { ThemeContext } from "../features/theme/theme-context";
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
  const themeContext = useContext(ThemeContext);
  const resolvedTheme = themeContext?.resolvedTheme;
  const imgSize = sizePixels[size];

  // Si está disponible ThemeContext, usar el logo según el tema resuelto;
  // de lo contrario, usar logoLight por defecto.
  const currentLogo = resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <div
      className={`brand-logo-container brand-logo-${size} ${className}`.trim()}
    >
      <div className="brand-logo-picture">
        <img
          src={currentLogo}
          alt="Cuaderno Logo"
          width={imgSize}
          height={imgSize}
          className="brand-logo-img"
        />
      </div>

      {showText && (
        <div className="brand-logo-text">
          <span className="brand-logo-title">Cuaderno</span>
        </div>
      )}
    </div>
  );
}

