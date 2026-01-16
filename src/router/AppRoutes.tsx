import { Route, Routes } from "react-router-dom";
import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login/Login";
import LoginHandler from "../pages/auth/Login/SocialLoginHandler";
import EmailSignUp from "../pages/auth/Signup/EmailSignUp";
import CalendarView from "../pages/CalendarView";

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

			{/* Main Feature page */}
			<Route path="/main" element={<CalendarView />} />
		</Routes>
	);
}
