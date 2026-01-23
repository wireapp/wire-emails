const fs = require('fs-extra');
const glob = require('glob');
const htmlToText = require('html-to-text');
const path = require('path');
const replace = require('replace-in-file');

const rootDirectory = path.join(__dirname, '..', 'dist');

function getFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, files) => {
      return error ? reject(error) : resolve(files);
    });
  });
}

function getSubjectFromHtml(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const subjectMatch = text.match(/<title[^>]*>([^<]*)<\/title>/);
  if (!subjectMatch) {
    return null;
  }
  return subjectMatch[1];
}

function getTextFromHtml(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  text = htmlToText.fromString(text);
  text = text.replace('[https://wire.com/p/img/email/logo-email-black.png]\n\n', '');
  text = text.replace('wire.com [https://wire.com]\n\n', '');
  return text;
}

function fixBrokenVariables() {
  const options = {
    files: `${rootDirectory}${path.sep}**${path.sep}*.txt`,
    from: /\$\{[a-zA-Z_]+\}/g,
    to: match => match.toLowerCase(),
  };
  try {
    const changes = replace.sync(options);
  } catch (error) {
    console.error('Error while replacing partial locale paths:', error);
  }
}

(async () => {
  const files = await getFiles(`${rootDirectory}/**/*.html`);

  const payloads = files.map(filePath => {
    const parsedPath = path.parse(filePath);
    return {
      textPath: path.join(parsedPath.dir, `${parsedPath.name}.txt`),
      text: getTextFromHtml(filePath),
      subjectPath: path.join(parsedPath.dir, `${parsedPath.name}-subject.txt`),
      subject: getSubjectFromHtml(filePath),
    };
  });

  const promises = payloads.map(payload => {
    fs.writeFile(payload.textPath, payload.text);
    if (payload.subject) {
      fs.writeFile(payload.subjectPath, payload.subject);
    }
  });

  try {
    await Promise.all(promises);
    console.log('Text emails and subjects have been created.');
    setTimeout(() => {
      fixBrokenVariables();
    }, 50);
  } catch (error) {
    console.log('Something went wrong.', error);
    process.exit(1);
  }
})();
