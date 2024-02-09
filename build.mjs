import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssPresetMantine from 'postcss-preset-mantine';
import postcssSimpleVars from 'postcss-simple-vars';

// Define the base build options
const baseOptions = {
  entryPoints: ['src/js/index.js'],
  bundle: true,
  loader: { '.js': 'jsx', '.png': 'dataurl' },
  logLevel: 'info',
  outfile: 'public/dist/bundle.js',
  plugins: [
    sassPlugin({
      async transform(source) {
        const { css } = await postcss([
          postcssPresetMantine,
          postcssSimpleVars({
            variables: {
              'mantine-breakpoint-xs': '36em',
              'mantine-breakpoint-sm': '48em',
              'mantine-breakpoint-md': '62em',
              'mantine-breakpoint-lg': '75em',
              'mantine-breakpoint-xl': '88em',
            },
          }),
          autoprefixer
        ])
          .process(source, { from: undefined });
        return css;
      },
    }),
  ],
};

// Function to build
function build() {
  esbuild.build({ ...baseOptions, minify: true, format: 'cjs' }).catch(() => process.exit(1));
}

// Function to watch
async function watch() {
  let ctx = await esbuild.context({
    ...baseOptions,
    format: 'iife'
  });
  await ctx.watch();
}

// Get the command-line argument
const arg = process.argv[2];

// Call the appropriate function based on the argument
if (arg === 'build') {
  build();
} else if (arg === 'watch') {
  watch();
} else {
  console.log('Please provide a valid command: "build" or "watch"');
}