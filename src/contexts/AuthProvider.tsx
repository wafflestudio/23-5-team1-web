import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import * as auth from "../api/auth";
import { TokenService } from "../api/tokenService";
import type { User } from "../util/types";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * INIT : check for existing session on page load
	 */
	useEffect(() => {
		const initAuth = async () => {
			try {
				// get new refreshToken using HttpOnly cookie
				const response = await auth.checkAuth();
				if (response.accessToken) {
					TokenService.updateLocalAccessToken(response.accesstoken);
					const userData = await auth.getUser();
					setUser(userData);
					setIsAuthenticated(true);
				}
			} catch (err) {
				// logout on failure
				console.error(err);
				TokenService.removeLocalAccessToken();
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};
		initAuth();
	}, []);

	/**
	 * Login Function
	 */
	const login = async (email: string, password: string) => {
		try {
			await auth.login(email, password);
			const userData = await auth.getUser();

			setUser(userData);
			setIsAuthenticated(true);
		} catch (err) {
			console.error("Login failed:", err);
			throw err;
		}
	};

	/**
	 * Signup Function
	 */
	const signup = async (email: string, password: string, name: string) => {
		try {
			await auth.signup(email, password, name);
			const userData = await auth.getUser();
			setUser(userData);
			setIsAuthenticated(true);
		} catch (err) {
			console.error("Signup failed:", err);
			throw err;
		}
	};

	/**
	 * Logout Func
	 */
	const logout = async () => {
		try {
			await auth.logout();
		} catch (error) {
			console.error("Server error at logout", error);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				login,
				signup,
				logout,
			}}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
