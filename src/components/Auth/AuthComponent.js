/* eslint-disable no-unused-vars */
import React, {
  useState, useEffect,
} from 'react';

import {
  Form, Button, Dropdown, Spinner, Row,
} from 'react-bootstrap';

import {
  PD_OAUTH_CLIENT_ID, PD_OAUTH_CLIENT_SECRET,
} from 'config/constants';

import {
  createCodeVerifier, getAuthURL, exchangeCodeForToken,
} from 'util/auth';

import './AuthComponent.scss';

const AuthComponent = (props) => {
  const [authURL, setAuthURL] = useState();

  const id = PD_OAUTH_CLIENT_ID;
  const secret = PD_OAUTH_CLIENT_SECRET;
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = sessionStorage.getItem('pd_access_token');
  const code = urlParams.get('code');
  let codeVerifier = sessionStorage.getItem('code_verifier');

  let {
    redirectURL,
  } = props;
  if (!redirectURL) {
    // assume that the redirect URL is the current page
    redirectURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }

  useEffect(() => {
    if (code && codeVerifier && !accessToken) {
      exchangeCodeForToken(id, secret, redirectURL, codeVerifier, code).then((token) => {
        sessionStorage.removeItem('code_verifier');
        sessionStorage.setItem('pd_access_token', token);
        window.location.assign(redirectURL);
      });
    } else if (!accessToken) {
      codeVerifier = createCodeVerifier();
      sessionStorage.setItem('code_verifier', codeVerifier);
      getAuthURL(id, secret, redirectURL, codeVerifier).then((url) => {
        setAuthURL(url);
      });
    }
  }, []);

  if (code && codeVerifier) {
    return (
      <div align="center">
        <br />
        <Row className="justify-content-md-center">
          <Spinner animation="border" role="status" variant="success" />
          <h5 className="querying-incidents">
            <b>Signing into PagerDuty Live</b>
          </h5>
        </Row>
      </div>
    );
  }
  return (
    <div align="center">
      <Form id="pd-login-form">
        <div id="pd-login-logo" />
        <Dropdown.Divider />
        <div id="pd-login-description">
          <h1>Live Incidents Console</h1>
          <p>Connect using PagerDuty OAuth to use this app</p>
        </div>
        <Button
          id="pd-login-button"
          variant="primary"
          size="lg"
          onClick={() => window.location.assign(authURL)}
        >
          Sign In
        </Button>
      </Form>
    </div>
  );
};

export default AuthComponent;
