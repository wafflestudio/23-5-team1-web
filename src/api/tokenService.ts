const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const TokenService = {
	getAccessToken: () => {
		return sessionStorage.getItem(ACCESS_KEY);
	},
	getRefreshToken: () => localStorage.getItem(REFRESH_KEY),

	setTokens: (access: string, refresh?: string | null) => {
		sessionStorage.setItem(ACCESS_KEY, access);
		if (refresh) {
			localStorage.setItem(REFRESH_KEY, refresh);
		}
	},

	clearTokens: () => {
		sessionStorage.removeItem(ACCESS_KEY);
		localStorage.removeItem(REFRESH_KEY);
	},
};
