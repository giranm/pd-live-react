/* eslint-disable no-param-reassign */
/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-bitwise */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable one-var */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-globals */
//
// PDOAuth - implementation of PKCE OAuth flow for PagerDuty
//
// Two ways to use:
//
// Simple:
//
// Just call PDOAuth.login(clientID) in your page, and let the library
// write the login button into your current DOM and store the token in your
// session storage.
//
// Manual:
//
// Get a PKCE code verifier and save it somewhere, like session storage:
//    const codeVerifier = PDOAuth.createCodeVerifier()
//    sessionStorage.setItem('code_verifier', codeVerifier)
//
// Get a PD login URL and make it be the destination of some link or button in your page:
//    PDOAuth.getAuthURL(clientID, redirectURL, codeVerifier).then((url) => {
//        document.getElementById("pd-login-button").href = url
//    })
//
// If the user completes the OAuth flow on the PD side, they will be directed back to
// your redirect URL with a code parameter in the query string, that you can exchange
// for a PD access token:
//    PDOAuth.exchangeCodeForToken(clientID, redirectURL, codeVerifier, code).then((token) => {
//        // Do stuff using the token...
//    }
//
// See the examples at https://github.com/martindstone/PDOAuth for more details!
//
export default class PDOAuth {
  static gen64x8bitNonce() {
    const array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    return array;
  }

  static async digestVerifier(vString) {
    const encoder = new TextEncoder();
    const verifier = encoder.encode(vString);
    const hash = await crypto.subtle.digest('SHA-256', verifier);
    return hash;
  }

  static base64Unicode(buffer) {
    // |*|  Base64 / binary data / UTF-8 strings utilities (#1)
    // |*|  https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    // |*|  Author: madmurphy
    const uint6ToB64 = function (nUint6) {
      return nUint6 < 26 ?
        nUint6 + 65 :
        nUint6 < 52 ?
          nUint6 + 71 :
          nUint6 < 62 ?
            nUint6 - 4 :
            nUint6 === 62 ?
              43 :
              nUint6 === 63 ?
                47 :
                65;
    };
    const base64EncArr = function (aBytes) {
      const eqLen = (3 - (aBytes.length % 3)) % 3;
      let sB64Enc = '';

      for (let nMod3, nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
        nMod3 = nIdx % 3;
        /* Uncomment the following line in order to split the output in lines 76-character long: */
        /*
        if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
        */
        nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
        if (nMod3 === 2 || aBytes.length - nIdx === 1) {
          sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
          nUint24 = 0;
        }
      }
      return eqLen === 0 ?
        sB64Enc :
        sB64Enc.substring(0, sB64Enc.length - eqLen) + (eqLen === 1 ? '=' : '==');
    };
    let encodedArr = base64EncArr(new Uint8Array(buffer));
    // manually finishing up the url encoding fo the encodedArr
    encodedArr = encodedArr.replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return encodedArr;
  }

  static createCodeVerifier() {
    // generate code verifier
    const generatedCode = this.gen64x8bitNonce();
    // base64 encode code_verifier
    return this.base64Unicode(generatedCode.buffer);
  }

  static async getAuthURL(clientID, clientSecret, redirectURL, codeVerifier) {
    const challengeBuffer = await this.digestVerifier(codeVerifier);
    // base64 encode the challenge
    const challenge = this.base64Unicode(challengeBuffer);
    // build authUrl
    const authUrl = 'https://app.pagerduty.com/oauth/authorize?' +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `redirect_uri=${redirectURL}&` +
      'response_type=code&' +
      `code_challenge=${encodeURI(challenge)}&` +
      'code_challenge_method=S256';

    return authUrl;
  }

  static async exchangeCodeForToken(clientID, clientSecret, redirectURL, codeVerifier, code) {
    // eslint-disable-next-line no-unused-vars
    function postData(url, _data) {
      return fetch(url, {
        method: 'POST',
      })
        .then((response) => response.json());
    }

    const requestTokenUrl = 'https://app.pagerduty.com/oauth/token?' +
      'grant_type=authorization_code&' +
      `code=${code}&` +
      `redirect_uri=${redirectURL}&` +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code_verifier=${codeVerifier}`;
    const data = await postData(requestTokenUrl, {});
    if (data.access_token) {
      return data.access_token;
    }
    console.log('Error in response from PD:', data);
  }

  static async checkElement(selector) {
    while (document.querySelector(selector) === null) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  }

  static writeLoginPage(clientID, clientSecret, redirectURL) {
    const { title } = document;
    document.write(
      `
            <title>${title}</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
            <div align="center">
                <p>&nbsp;</p>
                <h2>PagerDuty Login</h2>
                <i>Connect to PagerDuty to use <b>${title}</b></i>
                <p>&nbsp;</p>
                <a id="pd-login-button" class="btn btn-lg btn-primary auth-button">
                    Authorize PagerDuty
                </a>
            </div>
    `
    );
    const codeVerifier = PDOAuth.createCodeVerifier();
    sessionStorage.setItem('code_verifier', codeVerifier);

    PDOAuth.getAuthURL(clientID, clientSecret, redirectURL, codeVerifier).then((url) => {
      PDOAuth.checkElement('#pd-login-button').then((selector) => {
        selector.href = url;
      });
    });
  }

  static login(clientID, clientSecret, redirectURL_param) {
    if (sessionStorage.getItem('pd_access_token')) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let redirectURL = redirectURL_param;
    if (!redirectURL) {
      // assume that the redirect URL is the current page
      redirectURL = `${location.protocol}//${location.host}${location.pathname}`;
    }

    const code = urlParams.get('code');
    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (code && codeVerifier) {
      PDOAuth.exchangeCodeForToken(clientID, clientSecret, redirectURL, codeVerifier, code).then((token) => {
        if (token) {
          sessionStorage.setItem('pd_access_token', token);
          sessionStorage.removeItem('code_verifier');
          location.assign(redirectURL);
        } else {
          PDOAuth.writeLoginPage(clientID, clientSecret, redirectURL);
        }
      });
    } else {
      PDOAuth.writeLoginPage(clientID, clientSecret, redirectURL);
    }
  }

  static logout() {
    sessionStorage.removeItem('pd_access_token');
    location.reload();
  }
}
