import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BookIcon, MessageIcon, UsersIcon } from "../components/Icons";
import RecipeCard from "../components/RecipeCard";

function PublicFeed({ apiBaseUrl, user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/recipes`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load public recipes.");
          return;
        }

        setRecipes(data.recipes);
      } catch (requestError) {
        setError("Server is unavailable right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicRecipes();
  }, [apiBaseUrl]);

  return (
    <section className="feed-page rtl-page">
      <div className="feed-hero">
        <div className="feed-copy">
          <p className="eyebrow">ברוכים הבאים ל-CookSphere</p>
          <h1>
            ברוכים הבאים ל-CookSphere:
            <br />
            הפלטפורמה החברתית לשיתוף מתכונים
            <br />
            עם בינה מלאכותית
          </h1>
          <p>גלו, שתפו, צרו ואצרו מתכונים מדהימים עם הקהילה ובעזרת AI.</p>
          <div className="feed-hero-actions">
            <Link className="primary-button" to={user ? "/dashboard" : "/register"}>
              התחילו לשתף מתכונים
            </Link>
            {!user ? (
              <Link className="secondary-button" to="/login">
                הרשמה
              </Link>
            ) : null}
          </div>
        </div>
        <div className="hero-reference-panel panel">
          <img
            className="hero-reference-image"
            src="/home-screen-reference.png"
            alt="CookSphere homepage reference"
          />
        </div>
      </div>

      <div className="feed-section-heading">
        <div>
          <h2>סטטיסטיקות קהילה</h2>
        </div>
      </div>

      <div className="community-stats panel">
        <div className="community-stat-item">
          <MessageIcon className="stat-icon" />
          <span className="stat-label">אינטראקציות חודשיות:</span>
          <span className="stat-value">+50,000</span>
        </div>
        <div className="community-stat-item">
          <UsersIcon className="stat-icon" />
          <span className="stat-label">חברי קהילה פעילים:</span>
          <span className="stat-value">+8,300</span>
        </div>
        <div className="community-stat-item">
          <BookIcon className="stat-icon" />
          <span className="stat-label">מתכונים ציבוריים:</span>
          <span className="stat-value">+12,500</span>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <div className="centered-state panel">טוען את הפיד הציבורי...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state panel">
          <h3>אין עדיין מתכונים ציבוריים</h3>
          <p>ברגע שמשתמשים ישתפו מנות, הן יופיעו כאן לכל הקהילה.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PublicFeed;
