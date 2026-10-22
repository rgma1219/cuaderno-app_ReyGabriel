import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../../src/components/TodoItem';
import type { Task } from '../../src/types/task.types';

const baseTask: Task = {
  id: 'task-100',
  userId: 'user-100',
  title: 'Comprar insumos',
  description: 'Papel y cuadernos',
  completed: false,
  createdAt: 1000,
  updatedAt: 1000,
};

describe('Componente: TodoItem (Flujo de Edición e Interacción)', () => {
  it('debe alternar a modo edición al presionar el botón Editar', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    const editBtn = screen.getByRole('button', { name: /editar/i });
    await user.click(editBtn);

    expect(screen.getByDisplayValue('Comprar insumos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Papel y cuadernos')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /guardar cambios/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument();
  });

  it('debe cancelar la edición y restaurar los valores iniciales sin invocar onEditTask', async () => {
    const user = userEvent.setup();
    const onEditTask = vi.fn();

    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={vi.fn()}
        onEditTask={onEditTask}
        onDeleteTask={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));

    const titleInput = screen.getByDisplayValue('Comprar insumos');
    await user.clear(titleInput);
    await user.type(titleInput, 'Texto modificado que se cancelará');

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.queryByDisplayValue('Texto modificado que se cancelará')).not.toBeInTheDocument();
    expect(screen.getByText('Comprar insumos')).toBeInTheDocument();
    expect(onEditTask).not.toHaveBeenCalled();
  });

  it('debe validar que el título no quede vacío antes de guardar', async () => {
    const user = userEvent.setup();
    const onEditTask = vi.fn();

    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={vi.fn()}
        onEditTask={onEditTask}
        onDeleteTask={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));

    const titleInput = screen.getByDisplayValue('Comprar insumos');
    await user.clear(titleInput);

    // Enviar el formulario directamente para probar la validación de handleSaveEdit
    const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
    submitBtn.removeAttribute('required');
    titleInput.removeAttribute('required');
    await user.click(submitBtn);

    expect(
      screen.getByText('El título no puede quedar vacío.'),
    ).toBeInTheDocument();
    expect(onEditTask).not.toHaveBeenCalled();
  });

  it('debe guardar los cambios modificados y salir del modo edición', async () => {
    const user = userEvent.setup();
    const onEditTask = vi.fn().mockResolvedValueOnce(undefined);

    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={vi.fn()}
        onEditTask={onEditTask}
        onDeleteTask={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));

    const titleInput = screen.getByDisplayValue('Comprar insumos');
    await user.clear(titleInput);
    await user.type(titleInput, 'Comprar insumos premium');

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(onEditTask).toHaveBeenCalledWith('task-100', {
      title: 'Comprar insumos premium',
      description: 'Papel y cuadernos',
    });
  });

  it('debe mostrar mensaje visible de error si falla el toggle de la tarea', async () => {
    const user = userEvent.setup();
    const onToggleCompleted = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fallo de red al actualizar estado'));

    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={onToggleCompleted}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    const toggleBtn = screen.getByLabelText(/marcar como completada/i);
    await user.click(toggleBtn);

    expect(
      await screen.findByText('Fallo de red al actualizar estado'),
    ).toBeInTheDocument();
  });

  it('debe mostrar mensaje visible de error si falla la eliminación de la tarea', async () => {
    const user = userEvent.setup();
    const onDeleteTask = vi
      .fn()
      .mockRejectedValueOnce(new Error('No tienes permisos para borrar esta tarea'));

    render(
      <TodoItem
        task={baseTask}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={onDeleteTask}
      />,
    );

    // Primer click abre la confirmación
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    // Segundo click confirma ("Sí")
    await user.click(screen.getByRole('button', { name: /^sí$/i }));

    expect(
      await screen.findByText('No tienes permisos para borrar esta tarea'),
    ).toBeInTheDocument();
  });
});
