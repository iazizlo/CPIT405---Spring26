import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        setRecipe(await res.json());
      } catch (err) {
        setError(err.message || "Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="status-msg">Loading recipe…</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;
  if (!recipe) return null;

  const steps = recipe.analyzedInstructions?.[0]?.steps ?? [];

  return (
    <main className="details">
      <div className="details-hero">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="details-img"
          onError={(e) => { e.target.src = "https://placehold.co/636x393?text=No+Image"; }}
        />
        <div className="details-meta">
          <h1 className="details-title">{recipe.title}</h1>
          <div className="meta-chips">
            <span className="chip">{recipe.readyInMinutes} min</span>
            <span className="chip">{recipe.servings} servings</span>
            {recipe.vegetarian && <span className="chip green">Vegetarian</span>}
            {recipe.vegan && <span className="chip green">Vegan</span>}
            {recipe.glutenFree && <span className="chip green">Gluten-Free</span>}
          </div>
          {recipe.summary && (
            <p
              className="details-summary"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          )}
        </div>
      </div>

      <div className="details-body">
        <section className="ingredients-section">
          <h2>Ingredients</h2>
          <div className="ingredient-box">
            <ul className="ingredient-list">
              {recipe.extendedIngredients?.map((ing) => (
                <li key={ing.id ?? ing.originalName}>
                  <span className="ing-amount">{ing.measures?.us?.amount} {ing.measures?.us?.unitShort}</span>
                  <span className="ing-name">{ing.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {steps.length > 0 && (
          <section className="instructions-section">
            <h2>Instructions</h2>
            <div className="step-card">
              <div className="step-card-header">
                <span className="step-badge">Step {currentStep + 1}</span>
                <span className="step-counter">of {steps.length}</span>
              </div>
              <p className="step-card-text">{steps[currentStep].step}</p>
              <div className="step-card-nav">
                <button
                  className="btn-step btn-prev"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={currentStep === 0}
                >
                  Previous
                </button>
                <div className="step-dots">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      className={`step-dot${i === currentStep ? " active" : ""}`}
                      onClick={() => setCurrentStep(i)}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="btn-step btn-next"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={currentStep === steps.length - 1}
                >
                  Next Step
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
