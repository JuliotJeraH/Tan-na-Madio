import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-shell">
      <header className="hero-banner">
        <img src="/placeholder-logo.svg" className="hero-logo" alt="Tanàna Madio logo" />
        <div>
          <h1>Bienvenue dans Tanàna Madio</h1>
          <p>
            Modifiez <code>src/App.jsx</code> et enregistrez pour tester le rechargement à chaud.
          </p>
        </div>
      </header>

      <button type="button" className="counter" onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Votre point de départ pour le développement.</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer noopener">
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer noopener">
                Learn React
              </a>
            </li>
          </ul>
        </div>

        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Communauté</h2>
          <p>Rejoignez la communauté Vite / React.</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer noopener">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer noopener">
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer noopener">
                X.com
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default App
