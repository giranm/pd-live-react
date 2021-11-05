# PagerDuty Live

This repository hosts the source code for PagerDuty Live, an open-source, single page application which enables organisations to manage their PagerDuty incidents in real-time through a unified console view.

> Application URL: https://giranm.github.io/pd-live-react/

## :warning: Disclaimer 

**This project is not officially supported by PagerDuty and therefore no issues can be reported to or resolved by PagerDuty Support.
This is an open-source project designed to be used in a safe/test environment before users can leverage on their primary domains.**

- Further details on roadmap functionality, bugs, etc can be viewed on the [wiki](https://github.com/giranm/pd-live-react/wiki).
- For any issues, please raise a [GitHub issue](https://github.com/giranm/pd-live-react/issues/new) which can be tracked accordingly.

## Screenshot

<kbd>
<img width="1625" alt="Screenshot 2021-11-05 at 18 35 16" src="https://user-images.githubusercontent.com/20474443/140561598-d771ea60-157c-4fc6-aaa7-af31765f955f.png">
</kbd>

## Local Development

1. Install [NodeJS v11.10.1](https://nodejs.org/tr/blog/release/v11.10.1/) (or switch using [`asdf install`](https://github.com/asdf-vm/asdf))

2. Install `craco` via `$ npm install @craco/craco --save --global`  
   (NB - you may need to reload terminal session to use the alias)

3. `$ git clone` repo to desired destination and `$ cd pd-live-react` into directory.

4. Install dependencies with `$ npm install` and run application locally using `$ npm start`  
   (e.g. app will be available under http://localhost:3000/ - be sure to remove pd-live-react suffix)

## Deployment (GitHub Pages)

These steps assume you have forked the repo to a new GitHub repo and wish to deploy using [GitHub Pages](https://github.com/gitname/react-gh-pages).

1. Modify `homepage` within `package.json` accordingly (e.g. https://[GIT_USERNAME].github.io/pd-live-react/)

2. PagerDuty Configuration

   - Within PagerDuty developer mode, [register a new app](https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTY5-register-an-app)
   - [Add OAuth 2.0 workflow](<(https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTcz-o-auth-2-0-functionality#add-oauth-20-functionality-to-your-app)>) to the app, and update the URL to the base of the app to the same in step #1.

3. Update `clientIdRemoteHost` with the PagerDuty Client ID under `src/config/constants.js`.  
   (Don't forget to add and commit changes!)

4. (_Optional_) Create `gh-pages` branch for tracking

   - `$ git checkout -b gh-pages`
   - `$ git branch --set-upstream gh-pages origin/gh-pages`
   - `$ git push`
   - `$ git checkout -`

5. Install `gh-pages` module via `$ npm install gh-pages --save-dev --global`

6. Deploy application to GitHub Pages via `$ npm run deploy`

7. Application will be accessible under the homepage specified in step #1.

## Licence

MIT License

Copyright (c) 2021 Giran Moodley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
