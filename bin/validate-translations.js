const fileSystem = require('node:fs');
const path = require('node:path');

const numericHtmlTagPattern = /<\/?[0-9]+(?=\s|\/?>)[^>]*>/g;

function findInvalidPlaceholderTags(htmlContent) {
  return htmlContent.match(numericHtmlTagPattern) || [];
}

function collectHtmlFiles(directoryPath) {
  const directoryEntries = fileSystem
    .readdirSync(directoryPath, {withFileTypes: true})
    .sort((firstEntry, secondEntry) => firstEntry.name.localeCompare(secondEntry.name));
  const htmlFilePaths = [];

  for (const directoryEntry of directoryEntries) {
    const entryPath = path.join(directoryPath, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      htmlFilePaths.push(...collectHtmlFiles(entryPath));
      continue;
    }

    if (directoryEntry.isFile() && path.extname(directoryEntry.name).toLowerCase() === '.html') {
      htmlFilePaths.push(entryPath);
    }
  }

  return htmlFilePaths;
}

function findInvalidTranslations(translationDirectories) {
  const invalidTranslations = [];

  for (const translationDirectory of translationDirectories) {
    const htmlFilePaths = collectHtmlFiles(translationDirectory);

    for (const htmlFilePath of htmlFilePaths) {
      const htmlContent = fileSystem.readFileSync(htmlFilePath, 'utf8');
      const invalidPlaceholderTags = findInvalidPlaceholderTags(htmlContent);

      if (invalidPlaceholderTags.length > 0) {
        invalidTranslations.push({
          filePath: htmlFilePath,
          invalidPlaceholderTags,
        });
      }
    }
  }

  return invalidTranslations;
}

function formatValidationErrors(invalidTranslations, rootDirectory) {
  return invalidTranslations
    .flatMap(invalidTranslation =>
      invalidTranslation.invalidPlaceholderTags.map(
        invalidPlaceholderTag =>
          `${path.relative(rootDirectory, invalidTranslation.filePath)}: invalid numeric Crowdin placeholder ${invalidPlaceholderTag}`,
      ),
    )
    .join('\n');
}

function main() {
  const rootDirectory = path.resolve(__dirname, '..');
  const translationDirectories = ['src/pages', 'src/partials'].map(translationDirectory =>
    path.join(rootDirectory, translationDirectory),
  );

  try {
    const invalidTranslations = findInvalidTranslations(translationDirectories);

    if (invalidTranslations.length > 0) {
      console.error('Invalid numeric Crowdin placeholder tags found:');
      console.error(formatValidationErrors(invalidTranslations, rootDirectory));
      process.exitCode = 1;
      return;
    }

    console.log('Translation HTML validation passed.');
  } catch (error) {
    console.error(`Unable to validate translations: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  findInvalidPlaceholderTags,
  findInvalidTranslations,
  formatValidationErrors,
};
