import type { User } from "../util/types";
import api from "./axios";
import { TokenService } from "./tokenService";

export const getUser = async () => {
	const response = await api.get("/users/me");
	// TODO : get other info such as bookmark, memos, category preference, etc.
	return response.data as User;
};

export const signup = async (email: string, password: string, name: string) => {
	const response = await api.post("/auth/signup", {
		email,
		password,
		name,
	});

	if (response.data.accessToken) {
		TokenService.updateLocalAccessToken(response.data.accessToken);
	}

	// TODO : get newly made user instance & navigate to Onboarding page
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", {
		email,
		password,
	});

	if (response.data.accessToken) {
		TokenService.updateLocalAccessToken(response.data.accessToken);
	}

	return response.data;
	// TODO : login & navigate to Calendar page (main)
};

export const logout = async () => {
	// delete tokens
	await api.post("/auth/logout");
	TokenService.removeLocalAccessToken();
};

// TODO : make sure BE's using refresh token
export const checkAuth = async () => {
	const response = await api.post("/auth/refresh");
	return response.data;
	// TODO: make sure it returns accessToken
};
