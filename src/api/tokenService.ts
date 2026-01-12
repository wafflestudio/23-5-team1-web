const REFRESH_KEY = "refreshToken";
// private variable
let _accessToken: string | null = null;

export const TokenService = {
	getAccessToken: () => {
		return _accessToken;
	},
	getRefreshToken: () => localStorage.getItem(REFRESH_KEY),

	// update both tokens
	setTokens: (access: string, refresh?: string | null) => {
		_accessToken = access;

		if (refresh) {
			localStorage.setItem(REFRESH_KEY, refresh);
		}
	},

	clearTokens: () => {
		_accessToken = null;
		localStorage.removeItem(REFRESH_KEY);
	},
};
