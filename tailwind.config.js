/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/public/Assets/bg.jpg')",
        img1: "url('./src/assets/img1.png')",
        img2: "url('./src/assets/img2.png')",
        img3: "url('./src/assets/img3.png')",
        bgi: "url('https://th.bing.com/th/id/OIP.h7QHjKrMxxMPdwnksSu4hwHaEo?rs=1&pid=ImgDetMain')"
      },
    },
  },
  plugins: [],
};
