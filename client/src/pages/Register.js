import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ apiBaseUrl, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to register.");
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
        <p className="eyebrow">Create your food identity</p>
        <h1>Join CookSphere and build a shareable recipe world.</h1>
        <p className="hero-copy">
          Publish dishes to a public feed, keep personal notes private, and let
          AI turn instructions into visual cooking scenes.
        </p>
      </div>

      <form className="panel auth-panel" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="panel-subtitle">Start cooking with a modern workflow.</p>
        <label>
          Full name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your display name"
            required
          />
        </label>
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
            placeholder="Create a secure password"
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="form-link">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
