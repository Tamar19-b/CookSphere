import { useState } from "react";

function RecipeForm({ recipe, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    ingredients: recipe?.ingredients || "",
    steps: recipe?.steps || "",
    image_url: recipe?.image_url || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave(formData);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel recipe-form rtl-page" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">
            {recipe ? "עדכון מתכון" : "יצירת מנה חדשה"}
          </p>
          <h2>{recipe ? "עריכת פרטי מתכון" : "הוספת מתכון"}</h2>
        </div>
      </div>

      <label>
        שם המתכון
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="למשל: סלמון בגריל"
          required
        />
      </label>

      <label>
        רכיבים
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          rows="5"
          placeholder="רשימת רכיבים, כמויות והערות הכנה"
          required
        />
      </label>

      <label>
        שלבי הכנה
        <textarea
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          rows="7"
          placeholder="תאר את תהליך ההכנה שלב אחרי שלב"
          required
        />
      </label>

      <label>
        קישור לתמונה (אופציונלי)
        <input
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://images.example.com/dish.jpg"
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "שומר..." : recipe ? "עדכן מתכון" : "שמור מתכון"}
        </button>
        <button className="secondary-button" type="button" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
