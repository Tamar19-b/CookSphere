import { Link, useNavigate } from "react-router-dom";

function Navbar({ apiBaseUrl, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  };

  return (
    <header className="navbar">
      <nav className="nav-links">
        <Link to="/">מתכונים</Link>
        {user ? <Link to="/dashboard">קהילה</Link> : <span>קהילה</span>}
        <span>AI בפעולה</span>
        <span>אודות</span>
      </nav>

      <Link className="brand-mark" to="/">
        <strong>CookSphere</strong>
        <img
          className="brand-logo-image"
          src="/cooksphere-logo.png"
          alt="CookSphere logo"
        />
      </Link>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-chip">{user.name}</span>
            <button className="outline-light-button" onClick={handleLogout}>
              התנתקות
            </button>
          </>
        ) : (
          <>
            <Link className="outline-light-button" to="/login">
              הרשמה
            </Link>
            <Link className="light-solid-button" to="/register">
              התחברות
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
