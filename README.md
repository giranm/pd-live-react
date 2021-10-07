# PagerDuty Live (React)

This repository hosts the source code for the React implementation of [PDLive](https://github.com/martindstone/PDlive).  
It has been bootstrapped using [create-react-app](https://github.com/facebook/create-react-app).

### TODO

##### Functionality

- [ ] OAuth2 Login (will replace steps 2 + 3 from development use)
- [x] Escalate Incident
- [x] Reassign Incident
- [x] Add Responders to Incident
- [x] Update Priority of Incident
- [x] Custom snooze duration for Incident
- [x] Run Action (including Custom Incident Actions, Webhooks, and Response Plays)
- [x] Review appropriate React table (with resizeable columns)
- [x] Global Search against incident data
- [ ] Add loading modal when fetching data from `/incidents` endpoint
- [ ] Store query/settings using session data

##### Code

- [x] Linting + Formatting (via `prettier-eslint`)
- [ ] PagerDuty Themeing
- [ ] Tests (including suitable framework)
- [ ] Deployment/Bundling Steps

##### Bugs (Known)

- [x] Minor display bugs (incident resolution and creation duplication)
- [ ] Selected incidents which disappear post-action keeps state (e.g. enablePostActions remains true)
- [ ] External system sync (post-action) button (e.g. disabled correctly, but enabled on incident reselect due to incident store not refreshed)
- [x] Slow rendering with pagination implementation

## Local Development

1. Generate a personal PagerDuty REST API key and secure safely:  
   https://support.pagerduty.com/docs/generating-api-keys#generating-a-personal-rest-api-key

2. `git clone` repo to desired destination and `cd` into directory.

3. (Optional unless you are not serving at http://localhost:3000) Go into PD developer mode, create a new app, add OAuth 2.0 and add a URL to the base of wherever you are serving the app; put the Client ID from this app into App.js as the argument to `PDOAuth.login`

4. Install dependencies with `npm install` and run application locally using `npm start`  
   (e.g. served under http://localhost:3000/)
