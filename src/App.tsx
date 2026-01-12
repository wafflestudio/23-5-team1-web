import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { UserDataProvider } from "./contexts/UserDataContext";
import Home from "./auth/Home";
import Login from "./auth/Login";
import SignUp from "./auth/Signup/SignUp";

function App() {
	return (
		<AuthProvider>
			<UserDataProvider>
				<Routes>
					<Route path='/' element={<Home/>} />
					<Route path='/auth/login' element={<Login />} />
					<Route path='/auth/signup' element={<SignUp />} />
				</Routes>
			</UserDataProvider>
		</AuthProvider>
	);
}

export default App;
