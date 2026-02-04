import axios from "axios";
import type { AuthTokens, User } from "@types";
import api, { API_URL } from "./axios";
import { TokenService } from "./tokenService";

export const getUser = async (): Promise<User> => {
	const res = await api.get<User>("/users/me");
	console.log(res.data);
	return res.data;
};

export const updateUser = async (
	username?: string,
	profileImageUrl?: string,
) => {
	const response = await api.patch("/users/me", {
		username,
		profileImageUrl,
	});
	return response.data as User;
};

export const signup = async (email: string, password: string) => {
	const response = await api.post<AuthTokens>("/auth/register", {
		email,
		password,
	});

	TokenService.setTokens(response.data.accessToken, response.data.refreshToken);
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", {
		email,
		password,
	});

	TokenService.setTokens(response.data.accessToken, response.data.refreshToken);
};

export const socialLogin = async (
	provider: string,
	code: string,
	codeVerifier?: string,
) => {
	const res = await api.post<AuthTokens>("/auth/login/social", {
		provider,
		code,
		codeVerifier,
	});
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
		console.log("no refresh token");

		return null;
	}

	try {
		const { data } = await axios.post(
			`${API_URL}/auth/refresh`,
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			},
		);

		TokenService.setTokens(data.accessToken, data.refreshToken);

		const user = await getUser();
		return user;
	} catch (error) {
		console.error("error in authentication with refresh token", error);
		TokenService.clearTokens();
		throw error;
	}
};

// health check
export const healthCheck = async () => {
	const res = await api.get("/health");
	console.log(res.data);
};
