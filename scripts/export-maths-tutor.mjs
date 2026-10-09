import { cp, lstat, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'next.config.ts',
  'src/app',
  'public/tutor',
  'netlify/functions',
  'netlify/lib',
  'netlify/database/migrations',
  'tutor/docs',
  'tutor/README.md',
  'tutor/tests/netlify-integration.test.cjs',
  'tutor/tests/tutor-service.test.mjs',
  'tutor/tests/conversation-instructions.test.mjs',
  'tutor/tests/visual-teaching.test.mjs',
];

function containsPath(parent, candidate) {
  const difference = relative(parent, candidate);
  return difference === '' || (!difference.startsWith('..') && !isAbsolute(difference));
}

export async function exportMathsTutor(requestedDestination = resolve(repository, '../maths-tutor')) {
  const requested = resolve(requestedDestination);
  const parent = await realpath(dirname(requested));
  const destination = join(parent, relative(dirname(requested), requested));
  if (containsPath(repository, destination) || containsPath(destination, repository)) {
    throw new Error('Choose a new directory outside the existing repository.');
  }

  await mkdir(destination);
  try {
    for (const filename of projectFiles) {
      const target = join(destination, filename);
      await mkdir(dirname(target), { recursive: true });
      await cp(join(repository, filename), target, {
        recursive: true,
        filter: async (source) => {
          const sourceName = relative(repository, source);
          if (sourceName.split('/').some((segment) => segment.startsWith('.'))) return false;
          if (/\.(pem|key|p12|pfx)$/i.test(sourceName)) return false;
          if ((await lstat(source)).isSymbolicLink()) {
            throw new Error('The export cannot include symbolic links.');
          }
          return true;
        },
      });
    }

    const packagePath = join(destination, 'package.json');
    const packageData = JSON.parse(await readFile(packagePath, 'utf8'));
    packageData.name = 'maths-tutor';
    packageData.scripts.test = 'node --test tutor/tests/*.test.*';
    await writeFile(packagePath, `${JSON.stringify(packageData, null, 2)}\n`);

    const lockPath = join(destination, 'package-lock.json');
    const lockData = JSON.parse(await readFile(lockPath, 'utf8'));
    lockData.name = 'maths-tutor';
    lockData.packages[''].name = 'maths-tutor';
    await writeFile(lockPath, `${JSON.stringify(lockData, null, 2)}\n`);

    for (const filename of ['src/app/page.tsx', 'src/app/layout.tsx', 'public/tutor/index.html', 'tutor/README.md']) {
      const target = join(destination, filename);
      const content = await readFile(target, 'utf8');
      await writeFile(target, content.replaceAll('Universal Maths', 'Maths Tutor').replaceAll('universal maths', 'Maths Tutor'));
    }

    await writeFile(join(destination, '.gitignore'), 'node_modules\n.next\nout\n.netlify\n.env\n.env.*\n.DS_Store\n*.tsbuildinfo\nnext-env.d.ts\n');
    await writeFile(join(destination, 'netlify.toml'), '[build]\n  command = "npm run build"\n  publish = ".next"\n\n[functions]\n  directory = "netlify/functions"\n');
    await cp(join(repository, 'docs/MATHS_TUTOR_TRANSFER.md'), join(destination, 'README.md'));
    return destination;
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    throw error;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const destination = await exportMathsTutor(process.argv[2]);
    console.log(`Prepared Maths Tutor at ${destination}. No GitHub upload or Netlify deployment was performed.`);
  } catch (error) {
    console.error(error.code === 'EEXIST' ? 'The destination already exists; choose a new directory.' : error.message);
    process.exitCode = 1;
  }
}
