import { Link } from "react-router-dom";

function RecipeCard({
  recipe,
  ownedByUser = false,
  onEdit,
  onDelete,
  onTogglePublic,
}) {
  return (
    <article className="recipe-card panel">
      <div className="recipe-card-visual">
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
        <div className="recipe-card-glow" />
      </div>
      <div className="recipe-card-body">
        <div className="recipe-card-top">
          <div>
            <p className="recipe-meta">
              {recipe.author_name || "שם יוצר"}
            </p>
            <h3>{recipe.title}</h3>
          </div>
          <div className="mini-author-dot" />
        </div>

        <p className="recipe-preview">
          {recipe.ingredients.length > 120
            ? `${recipe.ingredients.slice(0, 120)}...`
            : recipe.ingredients}
        </p>

        <div className="recipe-card-footer">
          <span className="recipe-chip">ציבורי</span>
          <span>{recipe.is_public ? "סטטוס ציבורי" : "טיוטה פרטית"}</span>
        </div>

        <div className="recipe-card-actions">
          <Link className="primary-button recipe-card-cta" to={`/recipes/${recipe.id}`}>
            לצפייה במתכון
          </Link>
          {ownedByUser ? (
            <>
              <button className="secondary-button" onClick={onEdit}>
                עריכה
              </button>
              <button className="secondary-button" onClick={onTogglePublic}>
                {recipe.is_public ? "להפוך לפרטי" : "לשתף כציבורי"}
              </button>
              <button className="danger-button" onClick={onDelete}>
                מחיקה
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
