/**
 * Formatea la fecha actual en un formato amigable y legible en español.
 * Ejemplo: "Domingo, 18 de octubre de 2026"
 */
export function formatCurrentDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formatted = new Intl.DateTimeFormat('es-ES', options).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
