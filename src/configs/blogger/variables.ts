/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPayload } from "../interfaces/google";

const CLIENT_ID =
	"933127837947-asj25cbgrm5q2g2pd541vt6j77ukbk5gm.apps.googleusercontent.com";
const CLIENT_SECRETS = "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t";
const API_KEY = "AIzaSyA3H_u2_6HELRrheGnS_OJPZ4sBcIVOlu50";
const DISCOVERY_DOC =
	"https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest";
const SCOPES = ["email", "profile", "https://www.googleapis.com/auth/blogger"];
// {
// 	blogger: "https://www.googleapis.com/auth/blogger",
// 	userInfo: "email+profile",
// 	// userInfo: " https://www.googleapis.com/auth/userinfo.email",
// };

/**
 * http://localhost:3000 + pathname
 *
 * http://example.com + pathname
 * @example localhost('/profile/settings')
 */
const localhost = (pathname?: string) =>
	`${window.location.origin}${pathname || ""}`;

const setStorage = (
	key: string,
	value: any,
	replacer?: (number | string)[] | null,
	space?: string | number
) =>
	localStorage.setItem(
		key,
		typeof value === "string" ? value : JSON.stringify(value, replacer, space)
	);

const storages = {
	user: {
		get: localStorage.getItem("user"),
		set: (value: any) => setStorage("user", value),
	},
	email: {
		get: localStorage.getItem("email"),
		set: (value: any) => setStorage("email", value),
	},
	token: {
		get: localStorage.getItem("token"),
		set: (value: any) => setStorage("token", value),
	},
	blogId: {
		get: localStorage.getItem("blogId"),
		set: (value: string | string[]) => setStorage("blogId", value),
	},
	get: (key: string) => localStorage.getItem(key),
	remove: (values: string[]) =>
		values.forEach((item) => localStorage.removeItem(item)),
};

const userData = (): UserPayload => JSON.parse(storages.user.get as string);

export {
	CLIENT_ID,
	CLIENT_SECRETS,
	API_KEY,
	DISCOVERY_DOC,
	SCOPES,
	localhost,
	setStorage,
	storages,
	userData,
};
