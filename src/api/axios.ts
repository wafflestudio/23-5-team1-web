import axios from "axios";
import { TokenService } from "./tokenService";

const API_URL = "link";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	// headers: {
	// 	"Content-Type": "application/json",
	// },
});

api.interceptors.request.use(
	(config) => {
		const token = TokenService.getLocalAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
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
				// TODO : check whether BE has this feature; if they use refresh token in the first place
				const response = await axios.post(
					`${API_URL}/auth/refresh`,
					{},
					{
						withCredentials: true,
					},
				);
				// get new access token from response
				const { newAccessToken } = response.data.accessToken;

				// update storage
				TokenService.updateLocalAccessToken(newAccessToken);

				// update header
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// retry original request
				return api(originalRequest);
			} catch (refreshError) {
				// refresh failed :
				console.error("Session expired. Please sign in again");
				sessionStorage.removeItem("accessToken");
				// TODO : navigate back to login page
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);

export default api;
