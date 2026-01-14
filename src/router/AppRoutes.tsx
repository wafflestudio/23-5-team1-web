import { Route, Routes } from "react-router-dom";

import Home from "../auth/Home";
import LoginHandler from "../auth/Login/ SocialLoginHandler";
import Login from "../auth/Login/Login";
import EmailSignUp from "../auth/Signup/EmailSignUp";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/signup" element={<EmailSignUp />} />

			{/* OAuth Redirect */}
			<Route path="/oauth/kakao" element={<LoginHandler provider="kakao" />} />
			<Route
				path="/oauth/google"
				element={<LoginHandler provider="google" />}
			/>
			<Route path="/oauth/naver" element={<LoginHandler provider="naver" />} />
		</Routes>
	);
}
