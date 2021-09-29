# PagerDuty Live (React)

This repository hosts the source code for the React implementation of [PDLive](https://github.com/martindstone/PDlive).  
It has been bootstrapped using [create-react-app](https://github.com/facebook/create-react-app).

#### TODO

- [ ] OAuth2 Login (will replace steps 2 + 3 from development use)
- [x] Escalate Incident
- [ ] Reassign Incident
- [ ] Add Responders to Incident
- [x] Update Priority of Incident
- [ ] Custom snooze duration for Incident
- [ ] Run Action (including Custom Incident Actions, Webhooks, and Response Plays)
- [ ] Review appropriate React table (with resizeable columns)
- [ ] Store query/settings using session data
- [x] Minor display bugs (incident resolution and creation duplication)
- [ ] Tests (including suitable framework)
- [ ] Deployment/Bundling Steps

## Local Development

1. Generate a personal PagerDuty REST API key and secure safely:  
   https://support.pagerduty.com/docs/generating-api-keys#generating-a-personal-rest-api-key

2. `git clone` repo to desired destination and `cd` into directory.

3. Create `.env.local` environment file with the following contents:

   ```properties
   REACT_APP_PD_TOKEN=PAGERDUTY_PERSONAL_API_KEY_HERE
   ```

4. Install dependencies with `npm install` and run application locally using `npm start`  
   (e.g. served under http://localhost:3000/)
