module.exports = {
  purge: [
    './index.html',
    './components/**/*.{vue}',
    './layouts/**/*.{vue}',
    './pages/**/*.{vue}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-100': '#383838',
        'dark-200': '#313131',
        'dark-400': '#282828',
        'dark-500': '#202020',
      },
      flex: {
        '3': '0 0 33.33%'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ],
}
