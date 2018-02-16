#!/usr/bin/python
# coding: utf-8
#
# Wire
# Copyright (C) 2017 Wire Swiss GmbH
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see http://www.gnu.org/licenses/.
#

import os
import shutil
import sys
reload(sys)
sys.setdefaultencoding('utf8')

LANGUAGE_MAPPINGS = {
  'en': 'en',
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
}

IGNORE = list(set([k for k in LANGUAGE_MAPPINGS] + [LANGUAGE_MAPPINGS[k] for k in LANGUAGE_MAPPINGS]))

root = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
crowdin_yaml = os.path.join(root, 'keys', 'crowdin.yaml')
pages_dir = os.path.join(root, 'src', 'pages')
partials_dir = os.path.join(root, 'src', 'partials')
os.chdir(root)
os.system('crowdin --identity=%s upload sources' % crowdin_yaml)
os.system('crowdin --identity=%s download' % crowdin_yaml)


def apply_mapping(directory, filename):
  if filename in LANGUAGE_MAPPINGS and filename == LANGUAGE_MAPPINGS[filename]:
    return

  if filename in LANGUAGE_MAPPINGS:
    source = os.path.join(directory, filename)
    dest = os.path.join(directory, LANGUAGE_MAPPINGS[filename])
    if not os.path.exists(source):
      return

    if os.path.exists(dest):
      shutil.rmtree(dest)

    shutil.move(source, dest)


def process_dir(directory, filename):
  full_path = os.path.join(directory, filename)
  if filename not in IGNORE:
    if os.path.exists(full_path) and os.path.isdir(full_path):
      print 'Removing unsupported locale', directory, filename
      shutil.rmtree(full_path)
      return False
  return True


def dir_generator():
  for filename in os.listdir(pages_dir):
    yield (pages_dir, filename)

  for filename in os.listdir(partials_dir):
    yield (partials_dir, filename)


for directory, filename in dir_generator():
  if process_dir(directory, filename):
    apply_mapping(directory, filename)
