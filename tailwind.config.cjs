import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores principales con variantes
        primary: {
          DEFAULT: '#a277ff',
          glow: '#a277ff80',
          dark: '#815ace',
        },
        secondary: {
          DEFAULT: '#61ffca',
          glow: '#61ffca80',
          dark: '#4ed5aa',
        },
        accent: {
          DEFAULT: '#ffca85',
          glow: '#ffca8580',
          dark: '#d5a76f',
        },
        
        // Fondos y capas
        base: {
          DEFAULT: '#0f0f0f',
          100: '#121016',
          200: '#211D26',
          300: '#24222c',
          400: '#2d2d2d',
          500: '#2e2b38',
          gradient: 'linear-gradient(180deg, #0f0f0f 0%, #211D26 100%)',
        },
        
        // Efectos especiales
        glow: {
          primary: '#a277ff40',
          secondary: '#61ffca40',
          accent: '#ffca8540',
        },
        
        // Estados y alertas con efecto neón
        neon: {
          red: '#ff6767',
          blue: '#82e2ff',
          green: '#9dff65',
          purple: '#f694ff',
        },
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'blink': 'blink 1s steps(1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(100%)' },
          '50%': { filter: 'brightness(150%)' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"),require("daisyui")],
  daisyui: {
    themes: [
      {
        // cyberpunk: {
        //   ...// mantener configuración anterior de colores
        //   // "--border-btn":"2px",
        //   // "--tab-border": "2px",
        //   // "--tab-radius": "0", // Bordes más angulados
        // },
      },
    ],
  },
  plugins: [
    daisyui,
    function({ addUtilities }) {
      const newUtilities = {
        '.retro-border': {
          'border': '2px solid',
          'border-image': 'linear-gradient(45deg, #a277ff, #61ffca) 1',
          'clip-path': 'polygon(0 5px, 5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px))',
        },
        '.crt-screen': {
          'background': 'linear-gradient(rgba(18, 16, 16, 0.1) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          'background-size': '100% 2px, 3px 100%',
        }
      };
      addUtilities(newUtilities);
    }
  ],
};