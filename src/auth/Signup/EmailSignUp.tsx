import type React from "react"
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { signup } from "../../api/auth";
import ProfileSetting from "../OnBoarding/ProfileSetting";
import Onboarding from "../OnBoarding/Onboarding";
import CompleteSignUp from "../OnBoarding/CompleteSignUp";

export default function EmailSignUp() {

    const errorStatements = ["비밀번호는 8자 이상이어야 합니다.", "영문, 숫자, 특수문자를 포함해 주세요.", "비밀번호에 공백을 사용할 수 없습니다."];

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string[]>([]);
    const [pwConfirmError, setPwConfirmError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const step = (searchParams.get("step") as string) ?? "email";

    switch (step) {
        case 'profile': return <ProfileSetting />;
        case 'onboarding': return <Onboarding />;
        case 'complete': return <CompleteSignUp />;
    }

    const handlePwError = (value: string) => {
        const nextErrors: string[] = [];

        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9\s]/.test(value);

        if (value.length < 8) nextErrors.push(errorStatements[0]);
        if (!hasLetter || !hasNumber || !hasSpecial) nextErrors.push(errorStatements[1]);
        if (/\s/.test(value)) nextErrors.push(errorStatements[2]);

        setError(nextErrors);
        setPassword(value);
        setConfirmPassword("");
        setPwConfirmError("");
    }

    const handlePwConfirmChange = (value: string) => {
        setConfirmPassword(value);
        if (password !== value) setPwConfirmError("비밀번호가 일치하지 않습니다.");
        else setPwConfirmError("");
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(error.length === 0 &&
            password.length > 0 &&
            password === confirmPassword ) {
            signup(emailRef.current?.value || "", password, null).catch((err) => {
                console.error("Signup failed:", err);
            });
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("step", "profile");
                return next;
            });
        } else {
            alert("입력한 정보를 다시 확인해주세요.");
        }
    }
    return (
        <>
            <div>
                <h2>계정 생성</h2>
                <p>이메일과 비밀번호를 설정해주세요.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="email" required placeholder="email.snu.ac.kr" ref={emailRef}></input>
                <input type="password" required placeholder="비밀번호" value={password} onChange={(e) => handlePwError(e.target.value)}></input>
                {error?.map((err) => (<p key={err}>{err}</p>
                ))}
                <input type="password" required placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => handlePwConfirmChange(e.target.value)}></input>
                {pwConfirmError && <p>{pwConfirmError}</p>}
                <button type="submit">계정 생성</button>
            </form>
        </>
    )
}