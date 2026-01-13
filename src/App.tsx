import { AuthProvider } from "./contexts/AuthProvider";
import { EventProvider } from "./contexts/EventContext";
import { UserDataProvider } from "./contexts/UserDataContext";
<<<<<<< HEAD
import AppRoutes from "./router/AppRoutes";
=======
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup/SignUp";
>>>>>>> 0d2a270 (fix: server health check & import directory, pull conflicts, biome formats)

function App() {
	return (
		<AuthProvider>
			<EventProvider>
				<UserDataProvider>
<<<<<<< HEAD
					<AppRoutes />
=======
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/auth/login" element={<Login />} />
						<Route path="/auth/signup" element={<SignUp />} />
					</Routes>
>>>>>>> 0d2a270 (fix: server health check & import directory, pull conflicts, biome formats)
				</UserDataProvider>
			</EventProvider>
		</AuthProvider>
	);
}

export default App;
