/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#231F14',          // warm near-black, soil/wood undertone, primary bg
        nightblue: '#33301C',    // warm dark olive-brown surface
        parchment: '#F6EFDC',    // warm wheat-cream text / light surface
        brass: '#D6A233',        // harvest gold accent, sun-baked
        brassdim: '#95701F',
        sage: '#9CAD3A',         // vivid olive-lime, alive crop green
        clay: '#C1573D',         // urgent/warning accent, used sparingly
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        lattice:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23D6A233' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
