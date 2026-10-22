import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore';
import {
  createTask,
  updateTask,
  toggleTaskCompleted,
  deleteTask,
  subscribeUserTasks,
} from '../../src/services/task.service';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
}));

vi.mock('../../src/services/firebase', () => ({
  db: {},
}));

describe('Servicio de Tareas: task.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('debe crear una nueva tarea con fecha de creación y retornar el nuevo ID', async () => {
      vi.mocked(firestore.addDoc).mockResolvedValueOnce({
        id: 'new_task_123',
      } as unknown as firestore.DocumentReference);

      const taskId = await createTask('user_abc', {
        title: 'Mi nueva tarea',
        description: 'Descripción detallada',
      });

      expect(taskId).toBe('new_task_123');
      expect(firestore.addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          userId: 'user_abc',
          title: 'Mi nueva tarea',
          description: 'Descripción detallada',
          completed: false,
        }),
      );
    });
  });

  describe('updateTask', () => {
    it('debe actualizar los campos proporcionados y renovar updatedAt', async () => {
      vi.mocked(firestore.doc).mockReturnValueOnce(
        {} as unknown as firestore.DocumentReference,
      );
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

      await updateTask('task_123', {
        title: 'Título Actualizado',
        description: 'Nueva descripción',
      });

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: 'Título Actualizado',
          description: 'Nueva descripción',
          updatedAt: expect.any(Number),
        }),
      );
    });
  });

  describe('toggleTaskCompleted', () => {
    it('debe invertir el estado completed de true a false', async () => {
      vi.mocked(firestore.doc).mockReturnValueOnce(
        {} as unknown as firestore.DocumentReference,
      );
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

      await toggleTaskCompleted('task_123', true);

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          completed: false,
        }),
      );
    });

    it('debe invertir el estado completed de false a true', async () => {
      vi.mocked(firestore.doc).mockReturnValueOnce(
        {} as unknown as firestore.DocumentReference,
      );
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

      await toggleTaskCompleted('task_123', false);

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          completed: true,
        }),
      );
    });
  });

  describe('deleteTask', () => {
    it('debe invocar deleteDoc con la referencia correcta de la tarea', async () => {
      const mockRef = {} as unknown as firestore.DocumentReference;
      vi.mocked(firestore.doc).mockReturnValueOnce(mockRef);
      vi.mocked(firestore.deleteDoc).mockResolvedValueOnce();

      await deleteTask('task_to_delete');

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'tasks', 'task_to_delete');
      expect(firestore.deleteDoc).toHaveBeenCalledWith(mockRef);
    });
  });

  describe('subscribeUserTasks', () => {
    it('debe ordenar cronológicamente las tareas de más reciente a más antigua', () => {
      const mockDocs = [
        {
          id: 'task_1',
          data: () => ({
            userId: 'user_1',
            title: 'Tarea Antigua',
            description: '',
            completed: false,
            createdAt: 1000,
            updatedAt: 1000,
          }),
        },
        {
          id: 'task_2',
          data: () => ({
            userId: 'user_1',
            title: 'Tarea Reciente',
            description: '',
            completed: true,
            createdAt: 5000,
            updatedAt: 5000,
          }),
        },
      ];

      vi.mocked(firestore.onSnapshot).mockImplementation((_query, onNext: unknown) => {
        (onNext as (snapshot: unknown) => void)({ docs: mockDocs });
        return vi.fn();
      });

      const onUpdate = vi.fn();
      const onError = vi.fn();

      subscribeUserTasks('user_1', onUpdate, onError);

      expect(onUpdate).toHaveBeenCalledTimes(1);
      const receivedTasks = onUpdate.mock.calls[0][0];
      expect(receivedTasks[0].id).toBe('task_2'); // más reciente primero
      expect(receivedTasks[1].id).toBe('task_1');
    });

    it('debe invocar onError si ocurre un fallo en la sincronización', () => {
      vi.mocked(firestore.onSnapshot).mockImplementation((_query, _onNext: unknown, onErrorCallback: unknown) => {
        (onErrorCallback as (err: Error) => void)(new Error('Permiso denegado'));
        return vi.fn();
      });

      const onUpdate = vi.fn();
      const onError = vi.fn();

      subscribeUserTasks('user_1', onUpdate, onError);

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Permiso denegado',
        }),
      );
    });
  });
});
