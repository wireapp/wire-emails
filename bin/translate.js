/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

const fs = require('fs-extra');
const path = require('path');

const LANGUAGE_MAPPINGS = {
  en: 'en',
  'ar-SA': 'ar',
  'de-DE': 'de',
  'es-ES': 'es-ES',
  'et-EE': 'et',
  'fa-IR': 'fa',
  'fr-FR': 'fr',
  'it-IT': 'it',
  'pt-BR': 'pt-BR',
  'ru-RU': 'ru',
  'sv-SE': 'sv',
  'tr-TR': 'tr',
  'uk-UA': 'uk',
  'zh-TW': 'zh-TW',
};

const IGNORE = [...new Set(Object.keys(LANGUAGE_MAPPINGS).concat(Object.values(LANGUAGE_MAPPINGS)))];
const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'src', 'pages');
const partialsDir = path.join(rootDir, 'src', 'partials');

function getDirectories(directory) {
  let result = [];
  const dirs = fs.readdirSync(directory);
  for (let filename of dirs) {
    const fullPath = path.join(directory, filename);
    if (fs.lstatSync(fullPath).isDirectory()) {
      result.push([directory, filename]);
    }
  }
  return result;
}

const allDirectories = getDirectories(pagesDir).concat(getDirectories(partialsDir));

function checkLocaleDirectory(directory, filename) {
  fullPath = path.join(directory, filename);
  if (!IGNORE.includes(filename)) {
    if (fs.lstatSync(fullPath).isDirectory()) {
      console.log('Removing unsupported locale', directory, filename);
      fs.removeSync(fullPath);
      return false;
    }
  }
  return true;
}

function renameLocaleDirectory(directory, filename) {
  if (filename in LANGUAGE_MAPPINGS && filename == LANGUAGE_MAPPINGS[filename]) {
    return;
  }

  if (filename in LANGUAGE_MAPPINGS) {
    source = path.join(directory, filename);
    dest = path.join(directory, LANGUAGE_MAPPINGS[filename]);
    if (!fs.existsSync(source)) {
      return;
    }

    if (fs.existsSync(dest)) {
      fs.removeSync(dest);
    }

    fs.moveSync(source, dest);
  }
}

for ([directory, filename] of allDirectories) {
  if (checkLocaleDirectory(directory, filename)) {
    renameLocaleDirectory(directory, filename);
  }
}
