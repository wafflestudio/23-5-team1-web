import { AuthProvider } from "./contexts/AuthProvider";
import { EventProvider } from "./contexts/EventContext";
import { FilterContextProvider } from "./contexts/FilterContext";
import { UserDataProvider } from "./contexts/UserDataContext";

import AppRoutes from "./router/AppRoutes";

function App() {
	return (
		<AuthProvider>
			<EventProvider>
				<UserDataProvider>
					<FilterContextProvider>
						<AppRoutes />
					</FilterContextProvider>
				</UserDataProvider>
			</EventProvider>
		</AuthProvider>
	);
}

export default App;
