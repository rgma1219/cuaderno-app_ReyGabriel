import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../../src/components/TodoList';
import type { Task } from '../../src/types/task.types';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    userId: 'user-123',
    title: 'Tarea Pendiente 1',
    description: 'Descripción de la tarea 1',
    completed: false,
    createdAt: 1000,
    updatedAt: 1000,
  },
  {
    id: 'task-2',
    userId: 'user-123',
    title: 'Tarea Completada 2',
    description: 'Descripción de la tarea 2',
    completed: true,
    createdAt: 2000,
    updatedAt: 2000,
  },
];

describe('Componente: TodoList', () => {
  it('debe mostrar los skeleton loaders cuando loading es true', () => {
    render(
      <TodoList
        tasks={[]}
        loading={true}
        error={null}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    // Debe mostrar los esqueletos de carga
    const skeletons = document.querySelectorAll('.task-skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('debe mostrar el banner de alerta cuando hay un error', () => {
    render(
      <TodoList
        tasks={[]}
        loading={false}
        error="Fallo de conexión con Firestore"
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/fallo de conexión con firestore/i),
    ).toBeInTheDocument();
  });

  it('debe mostrar el estado vacío amigable cuando tasks está vacío', () => {
    render(
      <TodoList
        tasks={[]}
        loading={false}
        error={null}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/no tienes tareas registradas/i),
    ).toBeInTheDocument();
  });

  it('debe renderizar el listado de tareas con sus títulos y badges', () => {
    render(
      <TodoList
        tasks={mockTasks}
        loading={false}
        error={null}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByText('Tarea Pendiente 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea Completada 2')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('debe filtrar las tareas reactivamente por pestaña (Todas / Pendientes / Completadas)', async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        tasks={mockTasks}
        loading={false}
        error={null}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    // Filtro por Pendientes
    const pendingTab = screen.getByRole('button', { name: /pendientes \(1\)/i });
    await user.click(pendingTab);

    expect(screen.getByText('Tarea Pendiente 1')).toBeInTheDocument();
    expect(screen.queryByText('Tarea Completada 2')).not.toBeInTheDocument();

    // Filtro por Completadas
    const completedTab = screen.getByRole('button', { name: /completadas \(1\)/i });
    await user.click(completedTab);

    expect(screen.queryByText('Tarea Pendiente 1')).not.toBeInTheDocument();
    expect(screen.getByText('Tarea Completada 2')).toBeInTheDocument();
  });

  it('debe invocar onToggleCompleted cuando se hace clic en el checkbox', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <TodoList
        tasks={mockTasks}
        loading={false}
        error={null}
        onToggleCompleted={handleToggle}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    const toggleBtn = screen.getByRole('button', { name: /marcar como completada/i });
    await user.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith('task-1', false);
  });

  it('debe mostrar la confirmación al hacer clic en eliminar y llamar a onDeleteTask al confirmar con Sí', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(
      <TodoList
        tasks={mockTasks}
        loading={false}
        error={null}
        onToggleCompleted={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={handleDelete}
      />,
    );

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar tarea/i });
    await user.click(deleteButtons[0]);

    // Debe mostrar la confirmación en pantalla
    expect(screen.getByText('¿Eliminar?')).toBeInTheDocument();
    const confirmYesBtn = screen.getByRole('button', { name: 'Sí' });

    await user.click(confirmYesBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('task-1');
  });
});
