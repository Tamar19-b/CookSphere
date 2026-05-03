import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookIcon,
  EditIcon,
  EyeIcon,
  GlobeIcon,
  MessageIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "../components/Icons";
import RecipeForm from "../components/RecipeForm";

function Dashboard({ apiBaseUrl, user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const loadRecipes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/recipes/my`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to load your recipes.");
        return;
      }

      setRecipes(data.recipes);
    } catch (requestError) {
      setError("Server is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [apiBaseUrl]);

  const handleSave = async (recipeFormData) => {
    const isEditing = Boolean(editingRecipe);
    const endpoint = isEditing
      ? `${apiBaseUrl}/recipes/${editingRecipe.id}`
      : `${apiBaseUrl}/recipes`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(recipeFormData),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save recipe.");
    }

    setShowForm(false);
    setEditingRecipe(null);
    await loadRecipes();
  };

  const handleDelete = async (recipeId) => {
    const confirmed = window.confirm("למחוק את המתכון לצמיתות?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/recipes/${recipeId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to delete recipe.");
      return;
    }

    await loadRecipes();
  };

  const handleTogglePublic = async (recipeId) => {
    const response = await fetch(
      `${apiBaseUrl}/recipes/${recipeId}/toggle-public`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to update recipe visibility.");
      return;
    }

    await loadRecipes();
  };

  const publicRecipesCount = recipes.filter((recipe) => recipe.is_public).length;
  const privateRecipesCount = recipes.length - publicRecipesCount;

  return (
    <section className="dashboard-page rtl-page user-home-page">
      <div className="user-home-hero">
        <div>
          <h1>ברוך הבא חזרה, {user.name}! בדשבורד האישי שלך.</h1>
          <p className="user-home-subtitle">
            כאן תוכל לנהל את כל המתכונים שלך, לערוך אותם, לשלוט על פרטיותם,
            וליצור חדשים בעזרת AI.
          </p>
        </div>
        <button
          className="primary-button user-home-add-button"
          onClick={() => {
            setEditingRecipe(null);
            setShowForm((current) => !current);
          }}
        >
          <PlusIcon className="button-icon" />
          {showForm && !editingRecipe ? "סגירת הטופס" : "הוספת מתכון חדש"}
        </button>
      </div>

      <div className="user-home-stats">
        <div className="user-stat-card">
          <MessageIcon className="stat-icon" />
          <span className="user-stat-label">טיוטות פרטיות:</span>
          <strong className="user-stat-value">{privateRecipesCount}</strong>
        </div>
        <div className="user-stat-card">
          <UsersIcon className="stat-icon" />
          <span className="user-stat-label">מתכונים ציבוריים:</span>
          <strong className="user-stat-value">{publicRecipesCount}</strong>
        </div>
        <div className="user-stat-card">
          <BookIcon className="stat-icon" />
          <span className="user-stat-label">סך כל המתכונים:</span>
          <strong className="user-stat-value">{recipes.length}</strong>
        </div>
      </div>

      {showForm ? (
        <RecipeForm
          recipe={editingRecipe}
          onCancel={() => {
            setEditingRecipe(null);
            setShowForm(false);
          }}
          onSave={handleSave}
        />
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <div className="centered-state panel">טוען את המתכונים שלך...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state panel">
          <h3>עדיין אין מתכונים</h3>
          <p>
            אפשר להתחיל מהמתכון הראשון שלך, ולבחור אחר כך אם לשמור אותו פרטי
            או לשתף אותו עם כל קהילת CookSphere.
          </p>
        </div>
      ) : (
        <div className="user-dashboard-grid">
          <article className="user-recipe-card user-add-card">
            <div className="user-recipe-visual user-add-visual" />
            <div className="user-recipe-content">
              <h3>מתכון חדש (טיוטה)</h3>
              <span className="recipe-chip neutral-chip">טיוטה</span>
              <button
                className="primary-button recipe-card-cta"
                onClick={() => {
                  setEditingRecipe(null);
                  setShowForm(true);
                }}
              >
                <PlusIcon className="button-icon" />
                המשך עריכה
              </button>
              <button
                className="danger-soft-button"
                type="button"
                onClick={() => {
                  setEditingRecipe(null);
                  setShowForm(false);
                }}
              >
                <TrashIcon className="button-icon" />
                מחק
              </button>
            </div>
          </article>

          {recipes.map((recipe) => (
            <article className="user-recipe-card" key={recipe.id}>
              <div className="user-recipe-visual">
                {recipe.image_url ? (
                  <img
                    className="recipe-card-image"
                    src={recipe.image_url}
                    alt={recipe.title}
                  />
                ) : (
                  <div className="recipe-card-image fallback-image">
                    <span>{recipe.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="user-recipe-content">
                <h3>{recipe.title}</h3>
                <p className="recipe-preview">
                  {recipe.steps.length > 70
                    ? `${recipe.steps.slice(0, 70)}...`
                    : recipe.steps}
                </p>
                <div className="user-recipe-tags">
                  <span className="recipe-chip">
                    {recipe.is_public ? "ציבורי" : "פרטי"}
                  </span>
                </div>
                <div className="user-recipe-actions">
                  <button
                    className="icon-action-button"
                    onClick={() => handleTogglePublic(recipe.id)}
                  >
                    <GlobeIcon />
                    שינוי מצב
                  </button>
                  <button
                    className="icon-action-button"
                    onClick={() => {
                      setEditingRecipe(recipe);
                      setShowForm(true);
                    }}
                  >
                    <EditIcon />
                    עריכה
                  </button>
                  <Link className="icon-action-button" to={`/recipes/${recipe.id}`}>
                    <EyeIcon />
                    צפייה
                  </Link>
                  <button
                    className="icon-action-button delete-action"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <TrashIcon />
                    מחיקה
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
