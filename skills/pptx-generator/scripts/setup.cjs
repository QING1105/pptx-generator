const { constants, copyFileSync, existsSync, mkdirSync, readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const { dirname, join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

function setup(projectDirectory) {
  const skillDirectory = dirname(__dirname);
  const slidesDirectory = resolve(projectDirectory, 'slides');
  const manifests = ['package.json', 'package-lock.json'].map(name => ({
    source: join(skillDirectory, name),
    destination: join(slidesDirectory, name),
  }));
  mkdirSync(slidesDirectory, { recursive: true });

  for (const { source, destination } of manifests) {
    if (existsSync(destination) && !readFileSync(source).equals(readFileSync(destination))) {
      throw new Error(`Found a different manifest at ${destination}. Choose a separate presentation project directory.`);
    }
  }
  for (const { source, destination } of manifests) {
    if (!existsSync(destination)) copyFileSync(source, destination, constants.COPYFILE_EXCL);
  }

  const manifestPath = join(slidesDirectory, 'package.json');
  const dependencyPath = join(slidesDirectory, 'node_modules', 'pptxgenjs', 'package.json');
  const version = JSON.parse(readFileSync(manifestPath, 'utf8')).dependencies.pptxgenjs;
  const requireFromProject = createRequire(manifestPath);
  function hasRuntime() {
    if (!existsSync(dependencyPath)) return false;
    try {
      const PptxGenJS = requireFromProject('pptxgenjs');
      return new PptxGenJS().version === version;
    } catch {
      return false;
    }
  }

  if (!hasRuntime()) {
    const options = { cwd: slidesDirectory, stdio: 'inherit' };
    const args = ['ci', '--no-audit', '--no-fund'];
    const result = process.platform === 'win32'
      ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/c', 'npm.cmd', ...args], options)
      : spawnSync('npm', args, options);
    if (result.error) throw result.error;
    if (result.status !== 0 || !hasRuntime()) {
      throw new Error(`PptxGenJS ${version} setup failed. Check npm and access to the npm registry.`);
    }
  }
  console.log(`PptxGenJS ${version} ready in ${slidesDirectory}`);
}

try {
  if (process.argv.length !== 3) {
    throw new Error('Usage: node scripts/setup.cjs "<presentation project directory>"');
  }
  setup(process.argv[2]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
