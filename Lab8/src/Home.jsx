import { useState } from "react";

const BASE = "https://lnk.sh/";

function generateCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function Home({ links, onAdd }) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  function isValidUrl(value) {
    try { new URL(value); return true; } catch { return false; }
  }

  function handleShorten(e) {
    e.preventDefault();
    setError("");

    if (!longUrl.trim()) { setError("Please enter a URL."); return; }
    if (!isValidUrl(longUrl.trim())) {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    const alias = customAlias.trim() || generateCode();
    if (links.some((l) => l.alias === alias)) {
      setError(`The alias "${alias}" is already taken. Choose another.`);
      return;
    }

    onAdd({ original: longUrl.trim(), alias, short: BASE + alias });
    setLongUrl("");
    setCustomAlias("");
  }

  function handleCopy(short) {
    navigator.clipboard.writeText(short).then(() => {
      setCopied(short);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <main>
      <div className="home-grid">
        {/* Left column — form */}
        <div className="home-left">
          <h1 className="page-title">Shorten Your Links</h1>
          <p className="page-subtitle">
            Paste a long URL and get a short, shareable link instantly.
          </p>

          <div className="card">
            <form className="shorten-form" onSubmit={handleShorten}>
              <input
                type="text"
                placeholder="Paste your long URL here…"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="url-input"
              />
              <input
                type="text"
                placeholder="Custom alias (optional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="alias-input"
              />
              <button type="submit" className="btn-shorten">
                Shorten URL
              </button>
            </form>
          </div>

          {error && <p className="error">{error}</p>}
        </div>

        {/* Right column — illustration */}
        <div className="home-right">
          <img src="/Link_img.png" alt="Link shortener illustration" />
        </div>
      </div>

      {/* Results — full width below */}
      {links.length > 0 && (
        <section>
          <p className="results-title">Your Shortened Links</p>
          <ul className="link-list">
            {links.map((item) => (
              <li key={item.alias} className="link-card">
                <p className="link-original" title={item.original}>
                  {item.original}
                </p>
                <div className="link-row">
                  <a
                    href={item.original}
                    target="_blank"
                    rel="noreferrer"
                    className="link-short"
                  >
                    {item.short}
                  </a>
                  <button
                    className={`btn-copy${copied === item.short ? " copied" : ""}`}
                    onClick={() => handleCopy(item.short)}
                  >
                    {copied === item.short ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
