import dotenv from "dotenv";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const copyFile = promisify(fs.copyFile);
const readDir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readDir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await copyFile(srcPath, destPath);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(dirPath) {
  try {
    await stat(dirPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      await mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function setupModule() {
  const moduleBasePath = path.join(
    __dirname,
    "..",
    "node_modules/date-fns/locale",
  );

  const modulePath = path.join(
    moduleBasePath,
    process.env.APP_LOCALE || "en-US",
  );

  const destinationPath = path.join(
    __dirname,
    "..",
    "src/utils",
    "external",
    "local",
  );

  try {
    await ensureDir(path.dirname(modulePath));
    await ensureDir(path.dirname(destinationPath));

    await copyDir(modulePath, path.join(
      destinationPath,
      process.env.APP_LOCALE || "en-US",
    ));
    await copyFile(path.join(
      moduleBasePath,
      `${process.env.APP_LOCALE || "en-US"}.mjs`,
    ), path.join(
      destinationPath,
      `index.mjs`,
    ));
    console.info(
      `Module copied from
      ${modulePath} to
      ${path.dirname(destinationPath)}`,
    );
  } catch (error) {
    console.error("Error setting up module:", error);
  }
}

setupModule();
