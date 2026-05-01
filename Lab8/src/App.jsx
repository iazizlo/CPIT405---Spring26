import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import "./App.css";

  function Navbar() {
    const { pathname } = useLocation();
    return (
      <header>
        <nav>
          <span className="logo">🔗 LinkShrinker</span>
          <div className="nav-links">
            <Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/about" className={pathname === "/about" ? "active" : ""}>About Us</Link>
          </div>
        </nav>
      </header>
    );
  }

  export default function App() {
    const [links, setLinks] = useState([]);

    function addLink(entry) {
      setLinks((prev) => [entry, ...prev]);
    }

    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home links={links} onAdd={addLink} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer>
          <p>&copy; 2026 LinkShrinker</p>
        </footer>
      </Router>
    );
  }
