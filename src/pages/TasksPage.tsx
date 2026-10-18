import { useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { formatCurrentDate } from "../utils/date.utils";

export function TasksPage() {
  const { user, logout } = useAuth();
  const {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    toggleCompleted,
    removeTask,
    pendingCount,
    completedCount,
  } = useTasks();
  const [isFormOpenMobile, setIsFormOpenMobile] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const userDisplayName =
    user?.displayName || user?.email?.split("@")[0] || "Usuario";

  const todayFormatted = formatCurrentDate();

  return (
    <div className="app-shell">
      {/* Header Glassmorphism con información de usuario autenticado */}
      <header className="app-header glass-panel">
        <BrandLogo size="md" />
        <div className="header-actions">
          <div className="user-profile-badge">
            <span className="user-avatar-initial">
              {userDisplayName.charAt(0).toUpperCase()}
            </span>
            <span className="user-email-text">{user?.email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="glass-button glass-button-secondary header-logout-btn"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Layout dividido (Desktop 2 columnas, Mobile apilado) */}
      <main className="app-split-layout">
        {/* Panel lateral: Formulario de creación y acciones */}
        <aside className="sidebar-panel glass-panel">
          <div className="panel-title">
            <span>Crear Tarea</span>
            <button
              type="button"
              className="glass-button glass-button-secondary mobile-form-toggle-btn"
              onClick={() => setIsFormOpenMobile((prev) => !prev)}
              aria-expanded={isFormOpenMobile}
            >
              {isFormOpenMobile ? "✕ Ocultar" : "+ Nueva Tarea"}
            </button>
          </div>

          <div className={`sidebar-collapsible ${isFormOpenMobile ? "is-open" : ""}`}>
            <TodoForm
              onAddTask={addTask}
              onSuccess={() => setIsFormOpenMobile(false)}
            />

            <hr className="divider" />

            {/* Acción de AWS SES */}
            <div className="notification-section">
              <span className="form-label">Notificaciones</span>
              <button
                type="button"
                className="glass-button glass-button-secondary w-full"
              >
                📧 Enviar resumen por Email
              </button>
            </div>
          </div>
        </aside>

        {/* Panel principal: Listado de tareas */}
        <section className="content-panel glass-panel">
          <div className="content-header">
            <div>
              <h2 className="panel-title">Hola {userDisplayName}</h2>
              <span className="brand-subtitle">
                A continuación se encuentran tus tareas pendientes y
                completadas.
              </span>
            </div>
            <div className="current-date-badge">
              <span className="date-badge-icon">📅</span>
              <span>{todayFormatted}</span>
            </div>
          </div>

          <TodoList
            tasks={tasks}
            loading={loading}
            error={error}
            onToggleCompleted={toggleCompleted}
            onEditTask={editTask}
            onDeleteTask={removeTask}
          />
        </section>
      </main>
    </div>
  );
}
