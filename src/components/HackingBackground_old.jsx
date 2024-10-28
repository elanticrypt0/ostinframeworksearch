import React, { useEffect, useRef } from 'react';

const HackingBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajustar el canvas al tamaño de la ventana
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);

    const characters = "アカサタナハマヤャラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユュルグズブヅプエケセテネヘメレヱゲゼデベペオコソトノホモヨョロヲゴゾドボポヴッン0123456789";
    const columns = Math.floor(canvas.width / 20);
    const drops = new Array(columns).fill(0);
    
    // Colores del tema
    const colors = [
      '#a277ff', // primary
      '#61ffca', // secondary
      '#ffca85', // accent
      '#82e2ff', // info
    ];

    function draw() {
      // Crear efecto de desvanecimiento
      ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        // Seleccionar un color aleatorio del array de colores
        const colorIndex = Math.floor(Math.random() * colors.length);
        ctx.fillStyle = colors[colorIndex];
        
        // Obtener un carácter aleatorio
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Dibujar el carácter
        ctx.fillText(char, i * 20, drops[i] * 20);

        // Reiniciar la posición cuando llegue al final o aleatoriamente
        if (drops[i] * 20 > canvas.height || Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    // Animar
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: '#0f0f0f' }}
    />
  );
};

export default HackingBackground;