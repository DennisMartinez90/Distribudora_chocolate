/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Tailwind Configuration)
 * ====================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cacao: {
          950: '#1A0A03',
          900: '#2A1205',
          800: '#3D1C0A',
          700: '#4E2612',
          600: '#683318',
          500: '#8A4823',
          100: '#F5E6DC',
          50: '#FAF2EC',
        },
        oro: {
          900: '#8C6F12',
          800: '#B89025',
          700: '#D4AF37',
          600: '#E5C058',
          500: '#F59E0B',
          400: '#FCD34D',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        crema: {
          50: '#FFFFFF',
          100: '#FDF8F2',
          200: '#FAF2E9',
          300: '#F4E5D4',
        },
        selva: {
          900: '#1B4332',
          800: '#2D6A4F',
          700: '#40916C',
          500: '#52B788',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
