import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api";
import { useBranding } from "../../shared/hooks/useBranding";
import { Link } from "react-router-dom";

export default function Login() {
  const brand = useBranding();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "ADMIN") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
    }
  };

  return (
    <div className="min-w-screen mx-auto py-20 space-y-6 px-10 bg-gray-100 text-black">
      <div className="max-w-md mx-auto py-20 space-y-6 px-10 bg-white rounded-lg shadow-lg text-black">
        <h2 className="text-2xl font-semibold text-center">Login to {brand.siteName}</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className={`w-full py-2  text-white rounded-lg  ${brand.theme.button.primary} ${brand.theme.shape?.radius || ""}`}
          style={{ transition: "background-color 0.3s ease" }} >
          Login
        </button>

        <p className="text-center"> New to {brand.siteName}? <Link to="/register">Register Here.</Link></p>
        {popup && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Invalid credentials. Please try again.
          </div>
        )}
      </div></div>
  );
}
