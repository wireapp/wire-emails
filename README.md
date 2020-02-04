# wire-emails

[![Build Status](https://travis-ci.org/wireapp/wire-emails.svg?branch=master)](https://travis-ci.org/wireapp/wire-emails)

Templates for sending emails, based on [Foundation for Emails](https://foundation.zurb.com/emails.html).

Visit [wireapp.github.io/wire-emails/dist](https://wireapp.github.io/wire-emails/dist/) for the latest ✨ [**Live Preview**](https://wireapp.github.io/wire-emails/dist/) 💫

Help translate our emails via the [Crowdin project](https://crowdin.com/project/wire-launch).

## For Designers and Copywriters

- Find and edit the template in [`src/pages/en`](https://github.com/wireapp/wire-emails/tree/master/src/pages/en).
- To update shared text modules like headers, footers or signatures, edit the corresponding files in the [`src/partials/en`](https://github.com/wireapp/wire-emails/tree/master/src/partials/en) folder.
- commit your changes to `master`.
- After 2-3 minutes, Otto will re-build the files in the [`dist`](https://github.com/wireapp/wire-emails/tree/master/dist) folder.

If the files are not updated Otto-matically with the `Otto build` commit message, check the [commit list](https://github.com/wireapp/wire-emails/commits/master) for possible errors.


## For Translators

All translations are located in the [Crowdin project](https://crowdin.com/project/wire-launch).

When the original (English) email copy is changed via the GitHub UI or in a local clone and submitted via a pull request, the modified source text is uploaded to Crowdin for translation.

Translators use the [Crowdin UI](https://crowdin.com/project/wire-launch) to update the localized text strings.

Once the pull request is merged to `master`, the new translations are fetched from Crowdin and automatically downloaded into the project.


## Otto builds

When you commit to `master`, Otto will tell Travis to generate the new email templates and add an `Otto build` message to the [commits list](https://github.com/wireapp/wire-emails/commits/master). The absense of the `Otto build` will indicate an error as seen in the sreenshot below:

<img width="317" alt="Commit screenshot" src="https://user-images.githubusercontent.com/129995/36435445-ff5e85a6-1661-11e8-9e22-b1d2420e78f1.png">


## For Engineers

We recommend you set up the `wire-emails` repo to run locally on your computer so you can verify your changes before pushing them to the live site.

The instructions below assume you're on a Mac with [Homebrew](http://brew.sh) installed.

### Installation

1.  Install the [yarn](https://yarnpkg.com) JavaScript package manager via Homebrew:

    ```sh
    brew install yarn
    ```

2.  Clone this repository and run `yarn` from the root directory of your clone to install the necessary dependencies:

    ```sh
    yarn global add foundation-cli
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
