import { GlitchText, NeonButton, RetroCard } from './CyberpunkEffects';

// En tu componente
<div className="space-y-4">
  <GlitchText text="CYBERPUNK" className="text-2xl font-bold" />
  
  <NeonButton>
    Iniciar Hack
  </NeonButton>
  
  <RetroCard>
    <h2 className="text-primary">Sistema</h2>
    <p className="text-content-light">Datos clasificados</p>
  </RetroCard>
</div>

// Botón primario
<button className="btn btn-primary">Botón Principal</button>

// Tarjeta con fondo base
<div className="card bg-base-200 shadow-xl">
  <div className="card-body">
    <h2 className="card-title text-content">Título</h2>
    <p className="text-content-muted">Contenido secundario</p>
  </div>
</div>

// Alert con diferentes estados
<div className="alert alert-success bg-state-successBg">
  <span className="text-success">Operación exitosa</span>
</div>

// Elemento interactivo
<div className="p-4 bg-interactive hover:bg-interactive-hover 
                active:bg-interactive-pressed focus:bg-interactive-focus
                cursor-pointer transition-colors">
  Elemento Interactivo
</div>

// Badge con color de acento
<span className="badge badge-accent">Etiqueta</span>

// Input con borde primario
<input 
  type="text" 
  className="input input-bordered border-primary focus:border-primary-focus" 
  placeholder="Escribe algo..."
/>