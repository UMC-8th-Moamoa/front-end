// postcss.config.js
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

export default {
  plugins: [tailwindcss, autoprefixer, postcssNested],
};
