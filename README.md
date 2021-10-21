# PagerDuty Live (React)

This repository hosts the source code for the React implementation of [PDLive](https://github.com/martindstone/PDlive).  
It has been bootstrapped using [create-react-app](https://github.com/facebook/create-react-app).

### TODO

##### Functionality

- [x] OAuth2 Login
- [x] Escalate Incident
- [x] Reassign Incident
- [x] Add Responders to Incident
- [x] Update Priority of Incident
- [x] Custom snooze duration for Incident
- [x] Run Action (including Custom Incident Actions, Webhooks, and Response Plays)
- [x] Implement `react-table` (e.g. multisort, resizeable columns, selectable rows, etc)
- [x] Global Search against incident data
- [x] Formatting of cells (e.g. locale date format, status, etc)
- [x] Add loading modal when fetching data from `/incidents` endpoint
- [x] Infinite scrolling using `react-window`
- [ ] Store query/settings using session data

##### Code

- [x] Linting + Formatting (via `prettier-eslint`)
- [x] PagerDuty Themeing
- [ ] Tests (including suitable framework)
- [ ] Deployment/Bundling Steps

##### Bugs (Known)

- [x] Minor display bugs (incident resolution and creation duplication)
- [x] Slow query performance for large number of incidents (due to 100 results limit on API)
- [x] 429 (rate throttling) issues when requests notes for each incident (from large incident query above)
- [x] Empty Incident component rendered before table (for non-empty incidents list)
- [ ] Selected incidents which disappear post-action keeps state (e.g. enablePostActions remains true)
- [ ] External system sync (post-action) button (e.g. disabled correctly, but enabled on incident reselect due to incident store not refreshed)

## Local Development

1. `git clone` repo to desired destination and `cd` into directory.

2. _(Optional unless you are not serving at http://localhost:3000)_

   - Go into PD developer mode, create a new app, add OAuth 2.0 and add a URL to the base of wherever you are serving the app
   - Update `PD_OAUTH_CLIENT_ID` within `src/util/constants.js`, which is required for `PDOAuth.login()`

3. Install dependencies with `npm install` and run application locally using `npm start`  
   (e.g. served under http://localhost:3000/)
