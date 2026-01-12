import { AuthProvider } from "./contexts/AuthProvider";
import { EventProvider } from "./contexts/EventContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import AppRoutes from "./router/AppRoutes";

function App() {
	return (
		<AuthProvider>
			<EventProvider>
				<UserDataProvider>
					<AppRoutes />
				</UserDataProvider>
			</EventProvider>
		</AuthProvider>
	);
}

export default App;
