/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#005c55",
        "primary-container": "#0f766e",
        "on-primary": "#ffffff",
        "on-primary-container": "#a3faef",
        "primary-fixed": "#9cf2e8",
        "primary-fixed-dim": "#80d5cb",

        secondary: "#006b5f",
        "secondary-container": "#6df5e1",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#006f64",
        "secondary-fixed": "#71f8e4",

        tertiary: "#004eaa",
        "tertiary-container": "#0165d8",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#e4eaff",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        surface: {
          DEFAULT: "#faf8ff",
          0: "#f8fafc",
          1: "#ffffff",
          dim: "#d2d9f4",
          bright: "#faf8ff",
          variant: "#dae2fd",
          lowest: "#ffffff",
          low: "#f2f3ff",
          container: "#eaedff",
          high: "#e2e7ff",
          highest: "#dae2fd",
        },
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",

        "on-surface": "#131b2e",
        "on-surface-variant": "#3e4947",
        background: "#faf8ff",
        "on-background": "#131b2e",
        outline: "#6e7977",
        "outline-variant": "#bdc9c6",

        brand: {
          DEFAULT: '#0f766e',
          dark:    '#005c55',
          light:   '#14b8a6',
          accent:  '#0d9488',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted:   '#475569',
          subtle:  '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:  '12px',
        badge: '9999px',
        xl: '16px',
        '2xl': '20px',
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
      },
      keyframes: {
        loading: {
          '0%':   { width: '0%' },
          '60%':  { width: '80%' },
          '100%': { width: '95%' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(1.2)' },
        }
      },
      animation: {
        loading:   'loading 2s ease-in-out infinite',
        pulse_dot: 'pulse_dot 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
