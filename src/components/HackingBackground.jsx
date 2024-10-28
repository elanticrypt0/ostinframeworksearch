import React, { useEffect, useRef } from 'react';

const CyberpunkBackground = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

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

    // Caracteres para la matriz
    const katakana = "アカサタナハマヤャラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユュルグズブヅプエケセテネヘメレヱゲゼデベペオコソトノホモヨョロヲゴゾドボポヴッン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Arrays para las gotas
    const drops = new Array(columns).fill(0);
    const glowDrops = new Array(Math.floor(columns / 3)).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 2,
      intensity: Math.random()
    }));

    // Colores del tema
    const colors = {
      primary: '#a277ff',
      secondary: '#61ffca',
      accent: '#ffca85',
      info: '#82e2ff'
    };

    // Dibujar la rejilla
    function drawGrid() {
      ctx.strokeStyle = 'rgba(162, 119, 255, 0.1)';
      ctx.lineWidth = 0.5;

      // Líneas verticales
      for(let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Líneas horizontales
      for(let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Efecto de scanline
    function drawScanline(timestamp) {
      const scanlinePos = (timestamp / 30) % canvas.height;
      ctx.fillStyle = 'rgba(162, 119, 255, 0.1)';
      ctx.fillRect(0, scanlinePos, canvas.width, 2);
    }

    // Efecto de glitch
    function applyGlitch() {
      if (Math.random() < 0.01) { // 1% de probabilidad de glitch
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100;
        const height = Math.random() * 30;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(Math.random() < 0.5 ? -1 : 1, 1);
        ctx.drawImage(
          canvas, 
          x, y, width, height,
          0, 0, width, height
        );
        ctx.restore();
      }
    }

    // Dibujar los caracteres
    function drawMatrix(timestamp) {
      ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar la matriz principal
      ctx.font = `${fontSize}px monospace`;
      
      drops.forEach((drop, i) => {
        // Color principal para los caracteres
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = drop * fontSize;

        // Efecto de resplandor
        const glow = Math.sin(timestamp / 1000 + i) * 0.5 + 0.5;
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = glow * 0.5 + 0.5;
        
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        // Actualizar posición
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      });

      // Dibujar gotas con resplandor
      glowDrops.forEach(drop => {
        const glow = Math.sin(timestamp / 1000 + drop.x) * 0.5 + 0.5;
        ctx.fillStyle = colors.secondary;
        ctx.globalAlpha = glow * 0.3;
        
        ctx.fillText(
          alphabet[Math.floor(Math.random() * alphabet.length)],
          drop.x,
          drop.y
        );
        
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.x = Math.random() * canvas.width;
        }
      });
      
      ctx.globalAlpha = 1;
    }

    // Función principal de animación
    function animate(timestamp) {
      drawMatrix(timestamp);
      drawGrid();
      drawScanline(timestamp);
      applyGlitch();
      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    // Limpieza
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ background: '#0f0f0f' }}
      />
      <div className="fixed top-0 left-0 w-full h-full -z-9 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
        <div className="absolute inset-0 animate-scanline" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.02),rgba(0,0,255,0.03))] bg-[length:3px_100%]" />
      </div>
    </>
  );
};

export default CyberpunkBackground;