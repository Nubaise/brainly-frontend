import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password
            });
            alert("Signup successful! Please sign in.");
            navigate("/signin");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Signup failed");
            } else {
                alert("Signup failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-8">
                <Input ref={usernameRef} placeholder="Username" />
                <Input ref={passwordRef} placeholder="Password" type="password" />
                <div className="pt-4 flex justify-center">
                    <Button
                        onClick={signup}
                        loading={loading}
                        variant="primary"
                        text="Signup"
                        fullWidth={true}
                    />
                </div>
            </div>
        </div>
    );
}