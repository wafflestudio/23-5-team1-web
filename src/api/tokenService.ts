const REFRESH_KEY = "refreshToken";
const ACCESS_KEY = "accessToken";

let _accessToken: string | null = null;

export const TokenService = {
	getAccessToken: (): string | null => {
		if (_accessToken !== null) return _accessToken;

		const stored = localStorage.getItem(ACCESS_KEY);
		_accessToken = stored; // stored가 null이어도 캐시됨
		return stored;
	},

	getRefreshToken: (): string | null => {
		return localStorage.getItem(REFRESH_KEY);
	},

	setTokens: (access: string, refresh?: string | null) => {
		_accessToken = access;
		localStorage.setItem(ACCESS_KEY, access);

		// 정책: undefined=유지, null=삭제, string=저장
		if (refresh === undefined) return;
		if (refresh === null) {
			localStorage.removeItem(REFRESH_KEY);
			return;
		}
		localStorage.setItem(REFRESH_KEY, refresh);
	},

	clearTokens: () => {
		_accessToken = null;
		localStorage.removeItem(ACCESS_KEY);
		localStorage.removeItem(REFRESH_KEY);
	},
};

// 멀티탭 동기화(선택)
window.addEventListener("storage", (e) => {
	if (e.key === ACCESS_KEY) _accessToken = e.newValue;
	if (e.key === REFRESH_KEY && e.newValue === null) {
		// 필요하면 _accessToken = null; 로 강제 무효화도 가능
	}
});
