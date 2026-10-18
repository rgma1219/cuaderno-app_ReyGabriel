import { BrandLogo } from './components/BrandLogo';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      {/* Header Glassmorphism */}
      <header className="app-header glass-panel">
        <BrandLogo size="md" />
        <div className="header-actions">
          <button type="button" className="glass-button glass-button-secondary header-logout-btn">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Layout dividido (Desktop 2 columnas, Mobile apilado) */}
      <main className="app-split-layout">
        {/* Panel lateral: Creación y acciones */}
        <aside className="sidebar-panel glass-panel">
          <div className="panel-title">
            <span>Crear Tarea</span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="task-form">
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Título
              </label>
              <input
                id="task-title-input"
                type="text"
                className="glass-input"
                placeholder="Ej. Revisar propuesta comercial"
                readOnly
                value="Revisar propuesta comercial"
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                Descripción
              </label>
              <textarea
                id="task-desc-input"
                className="glass-textarea"
                rows={3}
                placeholder="Detalles de la tarea..."
                readOnly
                value="Analizar métricas del sprint y enviar informe a gerencia."
              />
            </div>

            <button type="button" className="glass-button glass-button-primary w-full">
              + Agregar Tarea
            </button>
          </form>

          <hr className="divider" />

          {/* Acción de AWS SES */}
          <div className="notification-section">
            <span className="form-label">Notificaciones</span>
            <button type="button" className="glass-button glass-button-secondary w-full">
              📧 Enviar resumen por Email
            </button>
          </div>
        </aside>

        {/* Panel principal: Listado de tareas */}
        <section className="content-panel glass-panel">
          <div className="content-header">
            <div>
              <h2 className="panel-title">Tareas del Día</h2>
              <span className="brand-subtitle">2 tareas pendientes, 1 completada</span>
            </div>
          </div>

          <div className="tasks-list-preview">
            <article className="task-card-preview glass-card">
              <div className="task-info">
                <span className="task-title">Revisar propuesta comercial</span>
                <span className="task-desc">Analizar métricas del sprint y enviar informe a gerencia.</span>
              </div>
              <span className="glass-badge badge-pending">
                Pendiente
              </span>
            </article>

            <article className="task-card-preview glass-card">
              <div className="task-info">
                <span className="task-title">Setup de Firebase y Firestore</span>
                <span className="task-desc">Configurar colecciones y credenciales de entorno.</span>
              </div>
              <span className="glass-badge badge-pending">
                Pendiente
              </span>
            </article>

            <article className="task-card-preview glass-card task-card-completed">
              <div className="task-info">
                <span className="task-title task-title-completed">
                  Definición de identidad visual
                </span>
                <span className="task-desc">Paletas y diseño de Glassmorphism acordados.</span>
              </div>
              <span className="glass-badge badge-completed">
                Completada
              </span>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
