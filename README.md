# wire-emails

[![Build Status](https://travis-ci.org/wireapp/wire-emails.svg?branch=master)](https://travis-ci.org/wireapp/wire-emails)

Templates for sending emails, based on [Foundation for Emails](https://foundation.zurb.com/emails.html).

Visit [wireapp.github.io/wire-emails/dist](https://wireapp.github.io/wire-emails/dist/) for the latest ✨ [**Live Preview**](https://wireapp.github.io/wire-emails/dist/) ✨

## For Designers

* Find and edit the template in [`src/pages/en`](https://github.com/wireapp/wire-emails/tree/master/src/pages/en) and commit your changes to `master`.
* After 2-3 minutes, Otto will re-build the files in the [`dist`](https://github.com/wireapp/wire-emails/tree/master/dist) folder.

If the files are not updated Otto-matically with the `Otto build` commit message, check the [commit list](https://github.com/wireapp/wire-emails/commits/master) for possible errors.

To update shared text modules like headers, footers or signatures, edit the corresponding files in the [`src/partials/en`](https://github.com/wireapp/wire-emails/tree/master/src/partials/en) folder.

## For Engineers

### Installation

```bash
yarn add global foundation-cli
yarn
```

### Start the local preview

This repository provides a local preview, so you can see what the final messages will look like.

To start the preview, run `yarn start` and check the results at [`localhost:3000`](http://localhost:3000).

A table of contents appears with links to each message. Click a link to display the rendered message content.

### Update

When you update the HTML files in the `src` folder, the results should be reflected automatically in the browser.

If not, make sure the local preview server is running or check the console for errors.

### Build

Run `yarn build` to inline your CSS into your HTML along with the rest of the build process.

### Translate

Run `yarn translate` to sync the translations with Crowdin.

### Otto builds

When you commit to `master`, Otto will tell Travis to generate the new email templates and add an `Otto build` message to the [commits list](https://github.com/wireapp/wire-emails/commits/master). The absense of the `Otto build` will indicate an error as seen in the sreenshot below:

<img width="317" alt="Commit screenshot" src="https://user-images.githubusercontent.com/125676/35437305-0d16b15c-0292-11e8-802a-e09242472bf8.png">
