const assert = require('node:assert');
const fileSystem = require('node:fs');
const operatingSystem = require('node:os');
const path = require('node:path');
const {test} = require('node:test');

const {
  findInvalidPlaceholderTags,
  findInvalidTranslations,
  formatValidationErrors,
} = require('./validate-translations');

function createTemporaryTranslationDirectory() {
  return fileSystem.mkdtempSync(path.join(operatingSystem.tmpdir(), 'wire-emails-translations-'));
}

function removeTemporaryTranslationDirectory(directoryPath) {
  fileSystem.rmSync(directoryPath, {force: true, recursive: true});
}

test('accepts ordinary HTML', () => {
  const actualInvalidTags = findInvalidPlaceholderTags('<p>Hello <strong>world</strong>.</p>');

  assert.deepStrictEqual(actualInvalidTags, []);
});

test('accepts project variables', () => {
  const actualInvalidTags = findInvalidPlaceholderTags('<p>Welcome to ${brand}, ${email}.</p>');

  assert.deepStrictEqual(actualInvalidTags, []);
});

test('detects an opening numeric placeholder tag', () => {
  const actualInvalidTags = findInvalidPlaceholderTags('<p><0>Translated text</0></p>');

  assert.strictEqual(actualInvalidTags[0], '<0>');
});

test('detects a closing numeric placeholder tag', () => {
  const actualInvalidTags = findInvalidPlaceholderTags('<p>Translated text</1>');

  assert.deepStrictEqual(actualInvalidTags, ['</1>']);
});

test('reports filenames and multiple invalid placeholders recursively', () => {
  const temporaryDirectory = createTemporaryTranslationDirectory();
  const pagesDirectory = path.join(temporaryDirectory, 'src', 'pages');
  const partialsDirectory = path.join(temporaryDirectory, 'src', 'partials');
  const invalidPagePath = path.join(pagesDirectory, 'ru', 'email.html');
  const invalidPartialPath = path.join(partialsDirectory, 'fr', 'footer.html');

  try {
    fileSystem.mkdirSync(path.dirname(invalidPagePath), {recursive: true});
    fileSystem.mkdirSync(path.dirname(invalidPartialPath), {recursive: true});
    fileSystem.writeFileSync(invalidPagePath, '<p><0>Russian text</1></p>');
    fileSystem.writeFileSync(invalidPartialPath, '<p>French text <2></p>');

    const actualInvalidTranslations = findInvalidTranslations([pagesDirectory, partialsDirectory]);
    const actualErrorOutput = formatValidationErrors(actualInvalidTranslations, temporaryDirectory);

    assert.strictEqual(actualInvalidTranslations.length, 2);
    assert.strictEqual(actualInvalidTranslations[0].invalidPlaceholderTags.length, 2);
    assert.strictEqual(actualInvalidTranslations[1].invalidPlaceholderTags.length, 1);
    assert.strictEqual(actualErrorOutput.includes(path.join('src', 'pages', 'ru', 'email.html')), true);
    assert.strictEqual(actualErrorOutput.includes(path.join('src', 'partials', 'fr', 'footer.html')), true);
    assert.strictEqual(actualErrorOutput.includes('<0>'), true);
    assert.strictEqual(actualErrorOutput.includes('</1>'), true);
    assert.strictEqual(actualErrorOutput.includes('<2>'), true);
  } finally {
    removeTemporaryTranslationDirectory(temporaryDirectory);
  }
});
