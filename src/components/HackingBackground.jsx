import React, { useEffect, useRef } from 'react';

const CyberpunkBackground = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  // Controles de velocidad
  const SPEED_CONFIG = {
    DROP_SPEED: 0.15,        // Velocidad de caída de los caracteres (menor = más lento)
    GLOW_SPEED: 0.5,        // Velocidad del efecto de resplandor
    SCANLINE_SPEED: 50,     // Velocidad de las líneas de escaneo
    GLITCH_PROBABILITY: 0.015, // Probabilidad de glitch (menor = menos frecuente)
    RESET_PROBABILITY: 0.99  // Probabilidad de que una gota se reinicie (mayor = más lento)
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);

    const katakana = "アカサタナハマヤャラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユュルグズブヅプエケセテネヘメレヱゲゼデベペオコソトノホモヨョロヲゴゾドボポヴッン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = new Array(columns).fill(0);
    const glowDrops = new Array(Math.floor(columns / 3)).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: SPEED_CONFIG.DROP_SPEED * (1 + Math.random()),
      intensity: Math.random()
    }));

    const colors = {
      primary: '#a277ff',
      secondary: '#61ffca',
      accent: '#ffca85',
      info: '#82e2ff'
    };

    function drawGrid() {
      ctx.strokeStyle = 'rgba(162, 119, 255, 0.1)';
      ctx.lineWidth = 0.5;

      for(let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for(let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function drawScanline(timestamp) {
      const scanlinePos = (timestamp / (1000 / SPEED_CONFIG.SCANLINE_SPEED)) % canvas.height;
      ctx.fillStyle = 'rgba(162, 119, 255, 0.1)';
      ctx.fillRect(0, scanlinePos, canvas.width, 2);
    }

    function applyGlitch() {
      if (Math.random() < SPEED_CONFIG.GLITCH_PROBABILITY) {
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

    function drawMatrix(timestamp) {
      ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      
      drops.forEach((drop, i) => {
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = drop * fontSize;

        const glow = Math.sin((timestamp / 1000) * SPEED_CONFIG.GLOW_SPEED + i) * 0.5 + 0.5;
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = glow * 0.5 + 0.5;
        
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > SPEED_CONFIG.RESET_PROBABILITY) {
          drops[i] = 0;
        } else {
          drops[i] += SPEED_CONFIG.DROP_SPEED;
        }
      });

      glowDrops.forEach(drop => {
        const glow = Math.sin((timestamp / 1000) * SPEED_CONFIG.GLOW_SPEED + drop.x) * 0.5 + 0.5;
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

    function animate(timestamp) {
      drawMatrix(timestamp);
      drawGrid();
      drawScanline(timestamp);
      applyGlitch();
      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

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