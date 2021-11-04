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
- [x] Merge Incidents
- [x] Run Action (including Custom Incident Actions, Webhooks, and Response Plays)
- [x] Implement `react-table` (e.g. multisort, resizeable columns, selectable rows, etc)
- [x] Global Search against incident data
- [x] Formatting of cells (e.g. locale date format, status, etc)
- [x] Add loading modal when fetching data from `/incidents` endpoint
- [x] Infinite scrolling using `react-window`
- [x] Store settings using session data: Global search, query settings, and table settings.

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
- [x] "Fetching notes" displayed when new incidents are added to the table (i.e. notes have not been fetched)
- [ ] Selected incidents which disappear post-action keeps state (e.g. enablePostActions remains true)
- [ ] External system sync (post-action) button (e.g. disabled correctly, but enabled on incident reselect due to incident store not refreshed)
- [ ] Resolved incidents still appear in the table after a period (most likely memoization of react-table)
- [x] Updating column order reverts to width defined under `src/util/incident-table-column.js`
- [ ] Updating columns may occasionally reset back to `minWidth`
- [x] `state.querySettings.incidentPriority` resets on render, thereby losing persisted data
- [ ] `react-select` within query settings does not render existing selections when not in view (needs re-rendering via hook)

## Local Development

1. Install [NodeJS v11.10.1](https://nodejs.org/tr/blog/release/v11.10.1/) (or switch using [`asdf install`](https://github.com/asdf-vm/asdf))

2. Install `craco` via `npm install @craco/craco --save --global`  
   (NB - you may need to reload terminal session to use the alias)

3. `git clone` repo to desired destination and `cd` into directory.

4. _(Optional unless you are not serving at http://localhost:3000)_

   - Go into PD developer mode, create a new app, add OAuth 2.0 and add a URL to the base of wherever you are serving the app
   - Update `PD_OAUTH_CLIENT_ID` within `src/util/constants.js`, which is required for `PDOAuth.login()`

5. Install dependencies with `npm install` and run application locally using `npm start`  
   (e.g. navigate to http://localhost:3000/ to use the app; be sure to remove pd-live-react suffix)
