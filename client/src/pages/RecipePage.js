import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AISceneViewer from "../components/AISceneViewer";

function RecipePage({ apiBaseUrl }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visualizing, setVisualizing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/recipes/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load recipe.");
          return;
        }

        setRecipe(data.recipe);
      } catch (requestError) {
        setError("Server is unavailable right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [apiBaseUrl, id]);

  const handleVisualize = async () => {
    if (!recipe) {
      return;
    }

    setVisualizing(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/ai/visualize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ingredients: recipe.ingredients,
          steps: recipe.steps,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to generate AI visualization.");
        return;
      }

      setScenes(data.scene_description);
    } catch (requestError) {
      setError("Server is unavailable right now.");
    } finally {
      setVisualizing(false);
    }
  };

  if (loading) {
    return <div className="centered-state panel">Loading recipe...</div>;
  }

  if (error && !recipe) {
    return <div className="form-error panel">{error}</div>;
  }

  if (!recipe) {
    return <div className="panel">Recipe not found.</div>;
  }

  return (
    <section className="recipe-page">
      <article className="recipe-detail panel">
        <div className="recipe-detail-top">
          <div>
            <p className="eyebrow">
              {recipe.is_public ? "Public recipe" : "Private recipe"}
            </p>
            <h1>{recipe.title}</h1>
            <p className="panel-subtitle">
              Shared by {recipe.author_name || "CookSphere chef"}
            </p>
          </div>
          <div className="recipe-hero-actions">
            <div className="insight-pill">
              <strong>{scenes.length || 0}</strong>
              <span>AI scenes ready</span>
            </div>
            <button
              className="primary-button"
              onClick={handleVisualize}
              disabled={visualizing}
            >
              {visualizing ? "Generating demo..." : "AI Visualize"}
            </button>
          </div>
        </div>

        {recipe.image_url ? (
          <img
            className="recipe-detail-image"
            src={recipe.image_url}
            alt={recipe.title}
          />
        ) : null}

        <div className="recipe-content-grid">
          <section>
            <h3>Ingredients</h3>
            <p className="recipe-text-block">{recipe.ingredients}</p>
          </section>
          <section>
            <h3>Preparation steps</h3>
            <p className="recipe-text-block">{recipe.steps}</p>
          </section>
        </div>
      </article>

      {error ? <p className="form-error">{error}</p> : null}
      <AISceneViewer scenes={scenes} loading={visualizing} />
    </section>
  );
}

export default RecipePage;
