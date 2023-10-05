/* eslint-disable no-cond-assign */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetToken, Prettify, UserPayload } from '../interfaces/google';
import {
  API_KEY,
  CLIENT_ID,
  CLIENT_SECRETS,
  DISCOVERY_DOC,
  SCOPES,
  storages,
  userData
} from './variables';
import { localhost } from '../../App/configs';
import axios from 'axios';

export async function gapiLoaded() {
  return await window.gapi?.load('client:auth2', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  return await window.gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC]
  });
}

export function accessTokenRedirect(connectBlogger = false) {
  const googleOAuth2 = {
    scope: connectBlogger === true ? SCOPES.join('+') : 'email+profile',
    // scope: SCOPES.join('+'),
    state: 'state_parameter_passthrough_value',
    redirect_uri: localhost(),
    access_type: 'offline',
    // include_granted_scopes: "true",
    response_type: 'code',
    client_id: CLIENT_ID
  };
  const googleOAuth2_uri = Object.entries(googleOAuth2)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join('&');

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${googleOAuth2_uri}`;
}

type AccessTokenProps = {
  callback?: (
    data: Prettify<GetToken> | Prettify<UserPayload>,
    credential?: string
  ) => Promise<any>;
};

export async function getAccessToken({ callback }: AccessTokenProps) {
  const hash = window.location.href.replace(window.location.origin, '');
  var fragmentString = hash.substring(2);
  var params: any = {};
  var regex = /([^&=]+)=([^&]*)/g,
    m;
  while ((m = regex.exec(fragmentString))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if (Object.keys(params).length > 0 && window.location.href.includes('googleapis.com')) {
    console.log(params);
    var code = params['code'];
    localStorage.setItem('auth_code', code);

    const url = 'https://oauth2.googleapis.com/token';
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRETS,
      code: localStorage.getItem('auth_code'),
      grant_type: 'authorization_code',
      redirect_uri: localhost()
    };

    return await axios
      .post(url, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        const data: GetToken = response.data;
        if (data.access_token) {
          return callback?.(data, data.id_token);
        }
      })
      .catch((err: Error) => {
        console.log('Error Data', err);
        // throw new Error(err.message);
      });
  }
}

interface RefreshTokenProps {
  user: Prettify<UserPayload>;
  setUser: (user: Record<string, any>) => void;
  redirectTo?: string;
  callback?: (data?: GetToken) => void;
}

export async function refreshToken({ user, setUser, redirectTo, callback }: RefreshTokenProps) {
  // const user = userData();
  const refresh_token = user.refresh_token;

  if (refresh_token) {
    const url = 'https://oauth2.googleapis.com/token';
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRETS,
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    };

    return await axios
      .post(url, data, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        const data: GetToken = response.data;
        if (data.access_token) {
          window.gapi && window.gapi?.client?.setToken(data);
          setUser({ ...user, token: data });
          if (redirectTo) {
            window.location.href = redirectTo;
          }
          callback?.(data);
        }
      })
      .catch((err: Error) => {
        console.log('Error Data', err);
        // throw new Error(err.message);
      });
  }
}
