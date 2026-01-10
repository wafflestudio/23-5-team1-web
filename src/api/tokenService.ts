const TOKEN_KEY = "accessToken";

export const TokenService = {
	getLocalAccessToken: () => {
		return sessionStorage.getItem(TOKEN_KEY);
	},

	updateLocalAccessToken: (token: string) => {
		sessionStorage.setItem(TOKEN_KEY, token);
	},

	removeLocalAccessToken: () => {
		sessionStorage.removeItem(TOKEN_KEY);
	},
};
