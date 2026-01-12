import axios from "axios";
import type { AuthTokens, User } from "../util/types";
import api, { API_URL } from "./axios";
import { TokenService } from "./tokenService";

export const getUser = async () => {
	const response = await api.get("/users/me");
	return response.data as User;
};

export const updateUser = async (name?: string, profileImageUrl?: string) => {
	const response = await api.patch("/users/me", {
		name,
		profileImageUrl,
	});
	return response.data as User;
};

export const signup = async (
	email: string,
	password: string,
	name: string | null,
) => {
	const response = await api.post<AuthTokens>("/auth/signup", {
		email,
		password,
		name,
	});

	TokenService.setTokens(response.data.accessToken, response.data.refreshToken);
	// TODO : get newly made user instance & navigate to Onboarding page
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", {
		email,
		password,
	});

	TokenService.setTokens(response.data.accessToken, response.data.refreshToken);
	// TODO : login & navigate to Calendar page (main)
};

export const socialLogin = async (provider: string, idToken: string) => {
	const res = await api.post<AuthTokens>("/auth/social", { provider, idToken });
	TokenService.setTokens(res.data.accessToken, res.data.refreshToken);
};

export const logout = async () => {
	// delete tokens
	try {
		await api.post("/auth/logout");
	} finally {
		TokenService.clearTokens();
	}
};

// Call on App mount!
export const checkAuth = async () => {
	const refreshToken = TokenService.getRefreshToken();

	if (!refreshToken) {
		return null;
	}

	try {
		const { data } = await axios.post(`${API_URL}/auth/refresh`, {
			refreshToken,
		});

		TokenService.setTokens(data.accessToken, data.refreshToken);

		const user = await getUser();
		return user;
	} catch (error) {
		TokenService.clearTokens();
		throw error;
	}
};
