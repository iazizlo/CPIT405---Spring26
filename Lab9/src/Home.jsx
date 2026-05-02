import { useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

export default function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(trimmed)}&number=12&addRecipeInformation=false&apiKey=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setRecipes(data.results ?? []);
    } catch (err) {
      setError(err.message || "Failed to fetch recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="home">
      <section className="hero-section">
        <h1>Find Your Favorite Recipe</h1>
        <p className="hero-sub">Search thousands of recipes by ingredient, cuisine, or dish name.</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g. pasta, chicken tikka, chocolate cake…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
      </section>

      {error && <p className="error-msg">{error}</p>}

      {!loading && searched && recipes.length === 0 && !error && (
        <p className="no-results">No recipes found for &ldquo;{query}&rdquo;. Try another keyword.</p>
      )}

      {recipes.length > 0 && (
        <section className="results-section">
          <p className="results-count">{recipes.length} recipes found</p>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-img"
                  onError={(e) => { e.target.src = "https://placehold.co/312x231?text=No+Image"; }}
                />
                <div className="recipe-card-body">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <span className="view-btn">View Recipe</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
