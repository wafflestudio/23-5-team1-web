import { Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { EventProvider } from "./contexts/EventContext";
import { UserDataProvider } from "./contexts/UserDataContext";

function App() {
	return (
		<AuthProvider>
			<EventProvider>
				<UserDataProvider>
					<Routes></Routes>
				</UserDataProvider>
			</EventProvider>
		</AuthProvider>
	);
}

export default App;
