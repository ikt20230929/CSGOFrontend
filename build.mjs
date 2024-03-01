import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssPresetMantine from 'postcss-preset-mantine';
import postcssSimpleVars from 'postcss-simple-vars';
import { stat, writeFile } from 'fs/promises';
import { execa } from 'execa';
import forge from 'node-forge';

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

async function fileExists(path) {
  try {
      return (await stat(path)).isFile();
  } catch (e) {
      return false;
  }
}

// Generate self signed certificate for https
async function cert() {
  if (!(await fileExists('ca.crt') && await fileExists('localhost.key') && await fileExists('localhost.crt'))) {
    const caKeys = forge.pki.rsa.generateKeyPair(4096);
    const caCert = forge.pki.createCertificate();
    caCert.publicKey = caKeys.publicKey;
    caCert.serialNumber = '01';
    caCert.validity.notBefore = new Date();
    caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 10);
    caCert.setSubject([{
      name: 'commonName',
      value: 'CSGO Dev CA'
    }]);
    caCert.setIssuer(caCert.subject.attributes);
    caCert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }]);

    caCert.sign(caKeys.privateKey, forge.md.sha256.create());

    const localhostKeys = forge.pki.rsa.generateKeyPair(4096);
    const localhostCert = forge.pki.createCertificate();
    localhostCert.publicKey = localhostKeys.publicKey;
    localhostCert.serialNumber = '02';
    localhostCert.validity.notBefore = new Date();
    localhostCert.validity.notAfter.setFullYear(localhostCert.validity.notBefore.getFullYear() + 2);
    const localhostAttrs = [{
      name: 'commonName',
      value: 'localhost'
    }];
    localhostCert.setSubject(localhostAttrs);
    localhostCert.setIssuer(caCert.subject.attributes);
    localhostCert.setExtensions([{
      name: 'basicConstraints',
      cA: false
    },{
      name: 'keyUsage',
      digitalSignature: true,
      keyEncipherment: true
    },{
      name: 'extKeyUsage',
      serverAuth: true
    },{
      name: 'subjectAltName',
      altNames: [{
        type: 2,
        value: 'localhost'
      }]
    }]);
    localhostCert.sign(caKeys.privateKey, forge.md.sha256.create());

    const localhostPem = forge.pki.certificateToPem(localhostCert);

    await writeFile('ca.crt', forge.pki.certificateToPem(caCert));
    await writeFile('localhost.key', forge.pki.privateKeyToPem(localhostKeys.privateKey));
    await writeFile('localhost.crt', localhostPem);

    if(process.platform == 'win32') {
      console.log('Installing certificate');
      await execa('certutil', ['-user', '-addstore', 'Root', 'ca.crt']);
    }
  }
}

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
} else if (arg === 'cert') {
  cert();
} else {
  console.log('Please provide a valid command: "build" or "watch" or "cert"');
}