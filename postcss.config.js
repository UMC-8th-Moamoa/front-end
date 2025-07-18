import postcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcss({
      config: './tailwind.config.js',
    }),
    autoprefixer,
  ],
};
