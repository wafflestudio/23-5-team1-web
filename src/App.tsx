import { Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { UserDataProvider } from "./contexts/UserDataContext";

function App() {
	return (
		<AuthProvider>
			<UserDataProvider>
				<Routes></Routes>
			</UserDataProvider>
		</AuthProvider>
	);
}

export default App;
