import { Route, Routes } from "react-router-dom";
import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login/Login";
import LoginHandler from "../pages/auth/Login/SocialLoginHandler";
import CompleteSignUp from "../pages/auth/OnBoarding/CompleteSignUp";
import EmailSignUp from "../pages/auth/Signup/EmailSignUp";
import CalendarView from "../pages/CalendarView";
import TimetablePage from "../pages/timetable/TimetablePage";
import SearchView from "@/pages/search/Search";
import { TimetableProvider } from "../contexts/TimetableContext";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/signup" element={<EmailSignUp />} />
			<Route path="/auth/complete" element={<CompleteSignUp />} />

			{/* OAuth Redirect */}
			<Route path="/oauth/kakao" element={<LoginHandler provider="kakao" />} />
			<Route
				path="/oauth/google"
				element={<LoginHandler provider="google" />}
			/>
			<Route path="/oauth/naver" element={<LoginHandler provider="naver" />} />

			{/* Main Feature page */}
			<Route path="/main" element={<CalendarView />} />

			{/* Timetable page */}
			<Route
				path="/timetable"
				element={
					<TimetableProvider>
						<TimetablePage />
					</TimetableProvider>
				}
			/>

			{/* Search page */}
			<Route path="/search" element={<SearchView />} />
		</Routes>
	);
}
