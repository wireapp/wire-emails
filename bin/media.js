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

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const smsDir = path.join(srcDir, 'sms');
const callDir = path.join(srcDir, 'call');

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

function copyMediaDirectories(directories) {
  for ([directory, filename] of directories) {
    const media = directory.split(path.sep).slice(-1)[0];
    for ([directory_, filename_] of getDirectories(path.join(directory, filename))) {
      const source = path.join(directory_, filename_);
      let dest = source.replace(srcDir, distDir).replace(`${media}${path.sep}`, '');
      dest = path.join(dest, media);
      fs.copySync(source, dest);
    }
  }
}

copyMediaDirectories(getDirectories(callDir).concat(getDirectories(smsDir)));
