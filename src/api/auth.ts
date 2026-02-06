import type {
	AuthTokens,
	Provider,
	SocialLoginRequestBody,
	User,
} from "@types";
import api from "./axios";
import { TokenService } from "./tokenService";

export const getUser = async (): Promise<User> => {
	const res = await api.get<User>("/users/me");
	return res.data;
};

export const updateUsername = async (username: string) => {
	await api.patch("/users/me", {
		username,
	});
};

export const clearProfileImg = async () => {
	await api.patch("/users/me", {
		profileImageUrl: null,
	});
};

export const uploadProfileImg = async (file: File) => {
	const fd = new FormData();
	fd.append("file", file);

	await api.post<{ url: string }>("/users/me/profile-image", fd);
};

export const signup = async (email: string, password: string) => {
	const response = await api.post<AuthTokens>("/auth/register", {
		email,
		password,
	});

	TokenService.setToken(response.data.accessToken);
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", {
		email,
		password,
	});

	TokenService.setToken(response.data.accessToken);
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
	TokenService.setToken(res.data.accessToken);
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
	try {
		const res = await api.post<AuthTokens>("/auth/refresh");
		TokenService.setToken(res.data.accessToken);
		const user = await getUser();
		return user;
	} catch {
		TokenService.clearTokens();
		return null;
	}
};

// health check
export const healthCheck = async () => {
	const res = await api.get("/health");
	console.log(res.data);
};
