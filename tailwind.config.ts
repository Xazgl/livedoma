import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'theme-light-bg': 'transparent',
        'theme-dark-bg': '#000000',
      },
      boxShadow: {
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      },
      screens: {
         
        'xs': '320px',
        
        's': '480px',

        'sm': '640px',
        // => @media (min-width: 576px) { ... }
  
        'md': '1100px',
        // => @media (min-width: 960px) { ... }
  
        'lg': '1440px',
        // => @media (min-width: 1440px) { ... }
        'xll': '1640px',
      },
    },
  },
  plugins: [],
}
export default config
