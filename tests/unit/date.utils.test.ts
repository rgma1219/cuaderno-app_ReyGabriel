import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatCurrentDate } from '../../src/utils/date.utils';

describe('Utilidad: formatCurrentDate', () => {
  beforeEach(() => {
    // Fijamos una fecha determinística para la prueba
    // 18 de Octubre de 2026 (Domingo)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 18, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe devolver la fecha actual formateada en español con la primera letra en mayúscula', () => {
    const formatted = formatCurrentDate();
    expect(formatted).toBe('Domingo, 18 de octubre de 2026');
  });

  it('debe contener el día de la semana, número, mes y año', () => {
    const formatted = formatCurrentDate();
    expect(formatted).toContain('18');
    expect(formatted).toContain('octubre');
    expect(formatted).toContain('2026');
  });
});
