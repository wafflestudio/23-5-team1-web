const ACCESS_KEY = "accessToken";

let _accessToken: string | null = null;

export const TokenService = {
	getToken: (): string | null => {
		if (_accessToken !== null) return _accessToken;

		const stored = localStorage.getItem(ACCESS_KEY);
		_accessToken = stored; // stored가 null이어도 캐시됨
		return stored;
	},

	setToken: (access: string) => {
		_accessToken = access;
		localStorage.setItem(ACCESS_KEY, access);
	},

	clearTokens: () => {
		_accessToken = null;
		localStorage.removeItem(ACCESS_KEY);
	},
};

// 멀티탭 동기화(선택)
window.addEventListener("storage", (e) => {
	if (e.key === ACCESS_KEY) _accessToken = e.newValue;
});
