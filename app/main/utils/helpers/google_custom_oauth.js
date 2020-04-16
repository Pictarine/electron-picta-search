const {google} = require('googleapis');
const Store = require('electron-store');

const store = new Store();

const {
  BACKEND_ENDPOINT,
} = require('../../../constants');

class OAuth2Custom extends google.auth.OAuth2 {
  async refreshTokenNoCache(refreshToken) {
    if (!refreshToken) {
      throw new Error('No refresh token is set.');
    }
    const url = `${BACKEND_ENDPOINT}/oauth/refresh_token/google`;
    const data = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };
    // request for new token
    const res = await this.transporter.request({
      method: 'POST',
      url,
      data: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    });
    console.log(res.data)
    const tokens = res.data;
    tokens.refresh_token = refreshToken
    store.set('google_tokens', tokens)
    // TODO: de-duplicate this code from a few spots
    if (res.data && res.data.expires_in) {
      tokens.expiry_date = new Date().getTime() + res.data.expires_in * 1000;
      delete tokens.expires_in;
    }
    this.emit('tokens', tokens);
    return {tokens, res};
  }
}

module.exports = {
  OAuth2Custom,
};
