import { useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { formatCurrentDate } from "../utils/date.utils";
import { sendTaskSummaryEmail } from "../services/email.service";

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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  const totalCount = tasks.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSendEmailSummary = async () => {
    if (!user?.email || tasks.length === 0 || isSendingEmail) return;

    setIsSendingEmail(true);
    setEmailFeedback(null);

    try {
      const response = await sendTaskSummaryEmail({
        recipientEmail: user.email,
        userDisplayName,
        tasks,
      });

      setEmailFeedback({
        type: "success",
        message: response.message || "¡Resumen enviado con éxito a tu correo!",
      });

      // Auto-ocultar mensaje de éxito tras 6 segundos
      setTimeout(() => {
        setEmailFeedback(null);
      }, 6000);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al despachar el correo.";
      setEmailFeedback({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

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

          <div
            className={`sidebar-collapsible ${isFormOpenMobile ? "is-open" : ""}`}
          >
            <TodoForm
              onAddTask={addTask}
              onSuccess={() => setIsFormOpenMobile(false)}
            />

            {/* Barra de Progreso en Vivo */}
            {totalCount > 0 && (
              <div className="task-progress-card">
                <div className="progress-info-header">
                  <span className="progress-label">Progreso</span>
                  <span className="progress-value">{progressPercentage}%</span>
                </div>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="progress-subtext">
                  {completedCount} de {totalCount} tareas completadas
                </span>
              </div>
            )}

            <hr className="divider" />

            {/* Acción de AWS SES */}
            <div className="notification-section">
              <span className="form-label">Notificaciones</span>

              {emailFeedback && (
                <div
                  className={`glass-alert glass-alert-${emailFeedback.type}`}
                  role="alert"
                >
                  <span className="alert-icon">
                    {emailFeedback.type === "success" ? "✅" : "⚠️"}
                  </span>
                  <span className="alert-text">{emailFeedback.message}</span>
                </div>
              )}

              <button
                type="button"
                className="glass-button glass-button-secondary w-full"
                onClick={handleSendEmailSummary}
                disabled={totalCount === 0 || isSendingEmail}
                title={
                  totalCount === 0
                    ? "Crea al menos una tarea para enviar el resumen"
                    : `Enviar resumen por correo electrónico a ${user?.email}`
                }
              >
                {isSendingEmail ? "Enviando resumen..." : "📧 Enviar resumen por Email"}
              </button>
              {totalCount === 0 && (
                <span className="form-hint-text">
                  Agrega al menos una tarea para habilitar el envío de resumen.
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Panel principal: Listado de tareas */}
        <section className="content-panel glass-panel">
          <div className="content-header">
            <div>
              <h2 className="panel-title">Hola {userDisplayName}</h2>
              <span className="brand-subtitle">
                {loading
                  ? "Sincronizando tareas con Firestore..."
                  : totalCount === 0
                    ? "Comienza creando tu primera tarea."
                    : `Tienes ${pendingCount} ${pendingCount === 1 ? "tarea pendiente" : "tareas pendientes"} y ${completedCount} ${completedCount === 1 ? "completada" : "completadas"}.`}
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
