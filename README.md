# wire-emails

[![Build Status](https://travis-ci.org/wireapp/wire-emails.svg?branch=master)](https://travis-ci.org/wireapp/wire-emails)

Templates for sending emails, based on [Foundation for Emails](https://foundation.zurb.com/emails.html).

This repository provides a local preview, so you can see what the final messages will look like.

✨ [**Live Preview**](https://wireapp.github.io/wire-emails/dist/) ✨

## For Designers

* Find and edit the template in [`src/pages`](https://github.com/wireapp/wire-emails/src/pages) and commit your changes to `master`.
* After 2-3 minutes, the files in the [`dist`](https://github.com/wireapp/wire-emails/dist) folder will be automatically re-built.

If the files are not updated automatically with the `Auto build` commit message, check the [commit list](https://github.com/wireapp/wire-emails/commits/master) for possible errors.

To update shared text modules like headers, footers or signatures, edit the corresponding files in the [`src/partials`](https://github.com/wireapp/wire-emails/src/partials) folder.

**Coming soon:** Instant preview of the templates inside the browser!

## For Engineers

### Installation

```bash
yarn add global foundation-cli
yarn
```

### Start the local preview

Run `yarn start` and check the results at [`localhost:3000`](http://localhost:3000).

A table of contents appears with links to each message. Click a link to display the message preview in a new tab.

### Update

When you update the HTML files in the `src` folder, the results should be reflected automatically in the browser.

If not, make sure the local preview server is running or check the console for errors.

### Build

Run `yarn build` to inline your CSS into your HTML along with the rest of the build process.

### Translate

Run `yarn translate` to sync the translations with Crowdin.

### Auto builds

When commiting to `master` emails will be generated automatically via Travis CI and visible after a few minutes with the `Auto build` message in the [commits list](https://github.com/wireapp/wire-emails/commits/master). The absense of the `Auto build` will indicate an error as seen from the sreenshot below:

<img width="317" alt="Commit screenshot" src="https://user-images.githubusercontent.com/125676/35437305-0d16b15c-0292-11e8-802a-e09242472bf8.png">
