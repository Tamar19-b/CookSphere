import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ apiBaseUrl, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to login.");
        return;
      }

      setUser(data.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError("Server is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="hero-card">
        <p className="eyebrow">Smart social cooking</p>
        <h1>Sign in to your CookSphere kitchen.</h1>
        <p className="hero-copy">
          Manage private recipes, share public favorites, and generate AI
          storyboard scenes for every dish.
        </p>
      </div>

      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="panel-subtitle">Log in to continue your cooking flow.</p>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="chef@cooksphere.com"
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="form-link">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
