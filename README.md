# PagerDuty Live

This repository hosts the source code for PagerDuty Live, an open-source, single page application which enables organisations to manage their PagerDuty incidents in real-time through a unified console view.

> Application URL: https://giranm.github.io/pd-live-react/

## :warning: Disclaimer

**This project is not officially supported by PagerDuty and therefore no issues can be reported to or resolved by PagerDuty Support.
This is an open-source project designed to be used in a safe/test environment before users can leverage on their primary domains.**

- Full Disclaimer: https://www.termsfeed.com/live/68d1a0f2-9e68-47d0-9623-68afe0c31f6d
- Further details on roadmap functionality, bugs, etc can be viewed on the [wiki](https://github.com/giranm/pd-live-react/wiki).
- For any issues, please raise a [GitHub issue](https://github.com/giranm/pd-live-react/issues/new) which can be tracked accordingly.

## Screenshot

<kbd>
<img width="1625" alt="Screenshot 2021-11-05 at 18 35 16" src="https://user-images.githubusercontent.com/20474443/140561598-d771ea60-157c-4fc6-aaa7-af31765f955f.png">
</kbd>

## Development

#### (Optional) Register PagerDuty App

If you wish to maintain + deploy your own version of PagerDuty Live, we recommend registering a new OAuth app as follows:

- Within PagerDuty developer mode, [register a new app](https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTY5-register-an-app)
- [Add OAuth 2.0 workflow](<(https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTcz-o-auth-2-0-functionality#add-oauth-20-functionality-to-your-app)>) to the app and update the URL to the app entrypoint  
  (see GitHub deployment steps below as an example)

#### Local Development

1. Install [NodeJS v16.13](https://nodejs.org/tr/blog/release/v16.13.0/) (or switch using [`asdf install`](https://github.com/asdf-vm/asdf))

2. Install `craco` via `$ yarn install @craco/craco --save --global`  
   (NB - you may need to reload terminal session to use the alias)

3. `$ git clone` repo to desired destination and `$ cd pd-live-react` into directory.

4. (_Optional_) Create `.env` file in project root with overriding configuration (see section below for details)

5. Install dependencies with `$ yarn install` and run application locally using `$ yarn start`  
   The app will be available under http://localhost:3000/pd-live-react

#### Environment Overrides

The following _optional_ parameters can be used in a `.env` file to override PagerDuty Live during local serve (`yarn start`):  
| Parameter | Usage |
| ----------- | ----------- |
| `REACT_APP_PD_OAUTH_CLIENT_ID` | PagerDuty OAuth App client ID (created upon registering app) |
| `REACT_APP_PD_OAUTH_CLIENT_SECRET` | PagerDuty OAuth App client secret (created upon registering app) |
| `REACT_APP_PD_USER_TOKEN` | PagerDuty [Personal API Token](https://support.pagerduty.com/docs/generating-api-keys#generating-a-personal-rest-api-key); this will override OAuth login workflow if set|
| `REACT_APP_PD_SUBDOMAIN_ALLOW_LIST` | Comma separated list of allowed subdomains (e.g. `acme-prod,acme-dev`) |

## Testing

The following scripts are created to run unit, component, and integration tests:

- `$ yarn jest` (Unit/Component)
- `$ yarn cypress:ci` (Integration)

## License

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
