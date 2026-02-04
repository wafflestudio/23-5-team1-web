import axios from "axios";
import { TokenService } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	// headers: {
	// 	"Content-Type": "application/json",
	// },
});

api.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";

    const isAuthApi =
      url.includes("/auth/login/social") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (isAuthApi) {
      delete config.headers.Authorization;
      return config;
    }

    const token = TokenService.getAccessToken();
    if (token && token.trim().length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);


// accessToken & refreshToken configuration
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// if error == 401 : retry with refreshToken
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = TokenService.getRefreshToken();
				if (!refreshToken) throw new Error("No refresh token");

				const { data } = await axios.post(
					`${API_URL}/auth/refresh`,
					{},
					{
						headers: {
							Authorization: `Bearer ${refreshToken}`,
						},
					},
				);
				// update storage
				TokenService.setTokens(data.accessToken /*, data.refreshToken*/);

				// update header
				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

				// retry original request
				return api(originalRequest);
			} catch (refreshError) {
				// refresh failed :
				TokenService.clearTokens();
				console.error("Session expired. Please sign in again");
				// TODO : navigate back to login page
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);

export { API_URL };
export default api;
