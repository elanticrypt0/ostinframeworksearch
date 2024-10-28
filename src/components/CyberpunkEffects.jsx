export const GlitchText = ({ text, className = "" }) => (
    <span className={`relative inline-block ${className} group`}>
      <span className="relative inline-block animate-glitch">
        {text}
        <span className="absolute top-0 left-0.5 w-full h-full text-primary-glow opacity-50 animate-glitch" aria-hidden="true">
          {text}
        </span>
        <span className="absolute -top-0.5 -left-0.5 w-full h-full text-secondary-glow opacity-50 animate-glitch" aria-hidden="true">
          {text}
        </span>
      </span>
    </span>
  );
  
  export const NeonButton = ({ children, className = "", ...props }) => (
    <button
      className={`
        relative px-6 py-2 
        bg-base-300 
        border-2 border-primary 
        text-primary hover:text-secondary
        transition-colors duration-300
        before:absolute before:top-0 before:left-0 
        before:w-full before:h-full 
        before:bg-primary/20 
        before:opacity-0 
        hover:before:opacity-100
        before:transition-opacity
        shadow-[0_0_15px_rgba(162,119,255,0.3)]
        hover:shadow-[0_0_25px_rgba(162,119,255,0.5)]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
  
  export const RetroCard = ({ children, className = "", ...props }) => (
    <div
      className={`
        relative p-6
        retro-border
        bg-base-200
        before:absolute before:inset-0
        before:bg-gradient-to-r 
        before:from-primary-glow before:to-secondary-glow
        before:opacity-0 
        hover:before:opacity-20
        before:transition-opacity
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );