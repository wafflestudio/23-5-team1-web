import axios from "axios";
import type {
	AuthTokens,
	Provider,
	SocialLoginRequestBody,
	User,
} from "@types";
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
	provider: Provider,
	code: string,
	codeVerifier?: string,
) => {
	TokenService.clearTokens();

	let body: SocialLoginRequestBody;
	if (provider === "GOOGLE") {
		if (!codeVerifier) {
			throw new Error("codeVerifier is required for Google login");
		}
		body = {
			provider: "GOOGLE",
			code,
			codeVerifier,
		};
	} else {
		body = {
			provider,
			code,
		};
	}
	const res = await api.post<AuthTokens>("/auth/login/social", body);
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

export const refresh = async () => {
	const res = await api.post<AuthTokens>("/auth/refresh");
	TokenService.setToken(res.data.accessToken);
};

// health check
export const healthCheck = async () => {
	const res = await api.get("/health");
	console.log(res.data);
};
