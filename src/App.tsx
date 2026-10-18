import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      {/* Header Glassmorphism */}
      <header className="app-header glass-panel">
        <div className="brand-wrapper">
          <div className="brand-icon">C</div>
          <div>
            <h1 className="brand-title">Cuaderno</h1>
            <span className="brand-subtitle">Gestor estratégico de tareas</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="glass-button glass-button-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
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

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="glass-input"
                placeholder="Ej. Revisar propuesta comercial"
                readOnly
                value="Revisar propuesta comercial"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="glass-textarea"
                rows={3}
                placeholder="Detalles de la tarea..."
                readOnly
                value="Analizar métricas del sprint y enviar informe a gerencia."
              />
            </div>

            <button type="button" className="glass-button glass-button-primary" style={{ width: '100%' }}>
              + Agregar Tarea
            </button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border-subtle)' }} />

          {/* Acción de AWS SES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span className="form-label">Notificaciones</span>
            <button type="button" className="glass-button glass-button-secondary" style={{ width: '100%' }}>
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
              <span className="glass-badge" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
                Pendiente
              </span>
            </article>

            <article className="task-card-preview glass-card">
              <div className="task-info">
                <span className="task-title">Setup de Firebase y Firestore</span>
                <span className="task-desc">Configurar colecciones y credenciales de entorno.</span>
              </div>
              <span className="glass-badge" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
                Pendiente
              </span>
            </article>

            <article className="task-card-preview glass-card" style={{ opacity: 0.75 }}>
              <div className="task-info">
                <span className="task-title" style={{ textDecoration: 'line-through' }}>
                  Definición de identidad visual
                </span>
                <span className="task-desc">Paletas y diseño de Glassmorphism acordados.</span>
              </div>
              <span className="glass-badge" style={{ background: 'var(--accent-success-bg)', color: 'var(--accent-success)' }}>
                Completada
              </span>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
