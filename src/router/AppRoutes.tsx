import { Routes, Route } from "react-router-dom";

import Home from "../auth/Home";
import Login from "../auth/Login/Login";
import EmailSignUp from "../auth/Signup/EmailSignUp";
import LoginHandler from "../auth/Login/ SocialLoginHandler";

export default function AppRoutes() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<EmailSignUp />} />

      {/* OAuth Redirect */}
      <Route path="/oauth/kakao" element={<LoginHandler provider="kakao" />} />
    </Routes>
  );
}