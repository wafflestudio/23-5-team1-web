import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export const Sidebar = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleHeaderClick = () => {
		// if user exists: refresh page
		if (user) {
			navigate("/main");
		} else {
			// else : go to login page
			navigate("/auth/login");
		}
	};

	return (
		<button type="button" onClick={handleHeaderClick}>
			{user ? `${user?.username}의 캘린더` : "로그인하고 이용하기"}
		</button>
	);
};
