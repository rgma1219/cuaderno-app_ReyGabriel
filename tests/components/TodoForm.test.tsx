import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../../src/components/TodoForm';

describe('Componente: TodoForm', () => {
  it('debe renderizar los campos de título, descripción y el botón de submit', () => {
    render(<TodoForm onAddTask={vi.fn()} />);

    expect(screen.getByLabelText(/título de la tarea/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción o notas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ agregar tarea/i })).toBeInTheDocument();
  });

  it('caso borde: no debe enviar el formulario si el título está vacío y debe mostrar alerta', async () => {
    const user = userEvent.setup();
    const handleAddTask = vi.fn();

    render(<TodoForm onAddTask={handleAddTask} />);

    const submitBtn = screen.getByRole('button', { name: /\+ agregar tarea/i });
    await user.click(submitBtn);

    expect(handleAddTask).not.toHaveBeenCalled();
    expect(
      screen.getByText(/el título de la tarea es obligatorio/i),
    ).toBeInTheDocument();
  });

  it('caso borde: no debe enviar el formulario si el título solo contiene espacios en blanco', async () => {
    const user = userEvent.setup();
    const handleAddTask = vi.fn();

    render(<TodoForm onAddTask={handleAddTask} />);

    const titleInput = screen.getByLabelText(/título de la tarea/i);
    await user.type(titleInput, '     ');

    const submitBtn = screen.getByRole('button', { name: /\+ agregar tarea/i });
    await user.click(submitBtn);

    expect(handleAddTask).not.toHaveBeenCalled();
    expect(
      screen.getByText(/el título de la tarea es obligatorio/i),
    ).toBeInTheDocument();
  });

  it('debe enviar la tarea correctamente y limpiar los inputs tras el éxito', async () => {
    const user = userEvent.setup();
    const handleAddTask = vi.fn().mockResolvedValue('task_id_123');
    const handleSuccess = vi.fn();

    render(<TodoForm onAddTask={handleAddTask} onSuccess={handleSuccess} />);

    const titleInput = screen.getByLabelText(/título de la tarea/i);
    const descInput = screen.getByLabelText(/descripción o notas/i);
    const submitBtn = screen.getByRole('button', { name: /\+ agregar tarea/i });

    await user.type(titleInput, 'Comprar café');
    await user.type(descInput, 'Tostado natural para la oficina');
    await user.click(submitBtn);

    expect(handleAddTask).toHaveBeenCalledTimes(1);
    expect(handleAddTask).toHaveBeenCalledWith({
      title: 'Comprar café',
      description: 'Tostado natural para la oficina',
    });

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descInput).toHaveValue('');
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('debe deshabilitar los campos e indicar estado de carga mientras se procesa el guardado', async () => {
    const user = userEvent.setup();
    // Promesa pendiente para simular latencia de red
    let resolvePromise: (value: string) => void;
    const pendingPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });
    const handleAddTask = vi.fn().mockImplementation(() => pendingPromise);

    render(<TodoForm onAddTask={handleAddTask} />);

    const titleInput = screen.getByLabelText(/título de la tarea/i);
    await user.type(titleInput, 'Tarea asíncrona');
    const submitBtn = screen.getByRole('button', { name: /\+ agregar tarea/i });

    await user.click(submitBtn);

    expect(screen.getByRole('button', { name: /guardando tarea\.\.\./i })).toBeDisabled();
    expect(titleInput).toBeDisabled();

    // Resolvemos la promesa y esperamos que el formulario finalice su actualización de estado
    resolvePromise!('id');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ agregar tarea/i })).not.toBeDisabled();
    });
  });
});
