import { Route, Routes } from "react-router-dom";
import Home from "./auth/Home";
import Login from "./auth/Login";
import SignUp from "./auth/Signup/SignUp";
import { AuthProvider } from "./contexts/AuthProvider";
import { EventProvider } from "./contexts/EventContext";
import { UserDataProvider } from "./contexts/UserDataContext";

function App() {
	return (
		<AuthProvider>
    	<EventProvider>
		    <UserDataProvider>
    			<Routes>
					   <Route path="/" element={<Home />} />
					   <Route path="/auth/login" element={<Login />} />
					   <Route path="/auth/signup" element={<SignUp />} />
				   </Routes>
      	</UserDataProvider>
      </EventProvider>
		</AuthProvider>
	);
}

export default App;
