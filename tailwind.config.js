// tailwind.config.js
module.exports = {
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          bold: ['Inter-Bold', 'sans-serif'],
          medium: ['Inter-Medium', 'sans-serif'],
          regular: ['Inter-Regular', 'sans-serif'],
        },
        colors: {
          primary: '#3b82f6', // ou sua cor personalizada
          secondary: '#f8fafc',
          background: '#ffffff',
          error: '#ef4444',
        },
      },
    },
    plugins: [],
  };