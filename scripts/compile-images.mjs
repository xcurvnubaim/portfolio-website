import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDir = path.join(root, "src/content/projects");
const outputDir = path.join(projectsDir, "optimized");
const manifestPath = path.join(root, "src/lib/generated/optimizedImages.js");
const imagePattern = /\.(avif|jpe?g|png|webp)$/i;
const widths = [480, 768, 1200];
const formats = [
  { extension: "avif", options: { quality: 62, effort: 6 } },
  { extension: "webp", options: { quality: 78, effort: 5 } }
];
const maxParallelJobs = Math.max(1, Number.parseInt(process.env.IMAGE_COMPILE_JOBS || "", 10) || Math.min(os.availableParallelism?.() ?? os.cpus().length, 4));

sharp.concurrency(1);

function quote(value) {
  return JSON.stringify(value);
}

async function runInPool(items, worker, concurrency = maxParallelJobs) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, runWorker));

  return results;
}

async function listProjectImages() {
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function compileVariant(sourcePath, outputPath, width, format) {
  const pipeline = sharp(sourcePath).rotate().resize({
    width,
    withoutEnlargement: true
  });

  if (format.extension === "avif") {
    await pipeline.avif(format.options).toFile(outputPath);
    return;
  }

  await pipeline.webp(format.options).toFile(outputPath);
}

function createImageJobs(fileName, index, metadata) {
  const sourcePath = path.join(projectsDir, fileName);
  const safeBaseName = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9_-]+/gi, "-");
  const targetWidths = widths.filter((width) => !metadata.width || width <= metadata.width);
  const selectedWidths = targetWidths.length > 0 ? targetWidths : [metadata.width].filter(Boolean);

  return formats.flatMap((format) =>
    selectedWidths.map((width) => {
      const outputFileName = `${safeBaseName}-${width}.${format.extension}`;

      return {
        format,
        sourcePath,
        outputPath: path.join(outputDir, outputFileName),
        manifestVariant: {
          format: format.extension,
          width,
          importName: `image${index}_${format.extension}_${width}`,
          importPath: `../../content/projects/optimized/${outputFileName}?url`
        }
      };
    })
  );
}

async function planImage(fileName, index) {
  const sourcePath = path.join(projectsDir, fileName);
  const metadata = await sharp(sourcePath).metadata();
  const variants = createImageJobs(fileName, index, metadata);
  const manifestVariants = variants.map((variant) => variant.manifestVariant);
  const fallback = manifestVariants.find((variant) => variant.format === "webp") ?? manifestVariants[0];

  return {
    jobs: variants,
    manifest: {
      key: `../content/projects/${fileName}`,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      fallback,
      variants: manifestVariants
    }
  };
}

function buildManifest(compiledImages) {
  const imports = compiledImages.flatMap((image) =>
    image.variants.map((variant) => `import ${variant.importName} from ${quote(variant.importPath)};`)
  );

  const entries = compiledImages.map((image) => {
    const sources = formats
      .map((format) => {
        const variants = image.variants.filter((variant) => variant.format === format.extension);
        const srcset = variants
          .map((variant) => `${"${"}${variant.importName}${"}"} ${variant.width}w`)
          .join(", ");

        return `      { type: "image/${format.extension}", srcset: \`${srcset}\` }`;
      })
      .join(",\n");

    return `  ${quote(image.key)}: {
    src: ${image.fallback.importName},
    width: ${image.width},
    height: ${image.height},
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
${sources}
    ]
  }`;
  });

  return `${imports.join("\n")}

export const optimizedImages = {
${entries.join(",\n")}
};
`;
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
const imageFiles = await listProjectImages();
const plans = await Promise.all(imageFiles.map((fileName, index) => planImage(fileName, index)));
const jobs = plans.flatMap((plan) => plan.jobs);

await runInPool(jobs, (job) => compileVariant(job.sourcePath, job.outputPath, job.manifestVariant.width, job.format));

const compiledImages = plans.map((plan) => plan.manifest);

await fs.writeFile(manifestPath, buildManifest(compiledImages));

console.log(`Compiled ${compiledImages.length} project image${compiledImages.length === 1 ? "" : "s"} with ${Math.min(maxParallelJobs, jobs.length)} parallel job${Math.min(maxParallelJobs, jobs.length) === 1 ? "" : "s"}.`);
