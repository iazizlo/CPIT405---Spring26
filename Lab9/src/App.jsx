import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./Home";
import RecipeDetails from "./RecipeDetails";
import "./App.css";

function Navbar() {
  const { pathname } = useLocation();
  return (
    <header>
      <nav>
        <Link to="/" className="logo">RecipeFinder</Link>
        <div className="nav-links">
          <Link to="/" className={pathname === "/" ? "active" : ""}>Search</Link>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
      <footer className="footer">
        <p>Powered by Spoonacular API &mdash; CPIT-405 Lab 9</p>
      </footer>
    </Router>
  );
}
