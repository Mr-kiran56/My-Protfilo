import "./Login.css";
import { useState } from "react";
import api from "./Api";
import { setToken, setUserId, setUsername } from "./auth";

function Login() {
  const [username, setUsernameState] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth", {
        username,
        email,
      });

      // ✅ SAVE AUTH DATA
      setToken(res.data.access_token);
      setUserId(res.data.user_id);
      setUsername(res.data.username || username); // fallback

      // ✅ clear inputs
      setUsernameState("");
      setEmail("");

      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <h2>Please! Fill This Info to Continue</h2>

        <div className="note-banner">
          <p>
            <strong>Note!</strong> This information will not be shared with anyone.
            This is only for identity purposes.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="continue-btn" disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
