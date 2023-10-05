import { GetToken, Prettify, UserPayload } from '../../configs/interfaces/google';
import { storages } from '../../configs/blogger/variables';
import axios, { AxiosResponse } from 'axios';

interface SignOutProps {
  user: Prettify<UserPayload>;
  redirectTo?: string;
  success?: (data: AxiosResponse<any, any>) => AxiosResponse<any, any>;
}

export async function signOut(options: SignOutProps) {
  const user = options.user;
  if (user.token && user.token.access_token && typeof window !== 'undefined') {
    const access_token = user.token.access_token;
    await revokeToken(access_token).then((data) => {
      axios.defaults.headers.common = {};
      storages.remove(['user', 'token']);
      window.gapi && window.gapi?.client.setToken('');
      options?.success?.(data);
      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
      }
    });
  } else if (user.userId) {
    storages.remove(['user', 'token']);
    if (options?.redirectTo) {
      window.location.href = options.redirectTo;
    }
  }
  return Promise.resolve();
}

export async function revokeToken(token: string) {
  const url = `https://oauth2.googleapis.com/revoke?token=${token}`;
  return await axios.post(
    url,
    {},
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
  );
}

export function parseJwt(token: string): UserPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
