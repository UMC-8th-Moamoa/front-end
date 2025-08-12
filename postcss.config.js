import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

export default {
  plugins: [tailwindcss, autoprefixer, postcssNested],
};
