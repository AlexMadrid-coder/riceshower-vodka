import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [count, setCount] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">React 19 + React Flow</h1>
        <p className="home-page__subtitle">
          Interactive node-based diagrams built with{' '}
          <code>@xyflow/react</code>, React Router and plain CSS.
        </p>
        <button
          className="home-page__cta"
          onClick={() => navigate('/diagram')}
        >
          Open Diagram →
        </button>
      </section>

      <section className="home-page__counter">
        <h2 className="home-page__section-title">useState demo</h2>
        <p className="home-page__counter-value">{count}</p>
        <div className="home-page__counter-actions">
          <button
            className="home-page__btn home-page__btn--secondary"
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </button>
          <button
            className="home-page__btn home-page__btn--secondary"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
          <button
            className="home-page__btn"
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </button>
        </div>
      </section>

      <section className="home-page__features">
        <h2 className="home-page__section-title">Stack</h2>
        <ul className="home-page__feature-list">
          {FEATURES.map((f) => (
            <li key={f.label} className="home-page__feature-item">
              <span className="home-page__feature-icon">{f.icon}</span>
              <div>
                <strong>{f.label}</strong>
                <p>{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: '⚛',
    label: 'React 19',
    description: 'Latest stable release with concurrent features.',
  },
  {
    icon: '🔷',
    label: 'TypeScript (strict)',
    description: 'Full type safety across the entire codebase.',
  },
  {
    icon: '🔗',
    label: '@xyflow/react v12',
    description: 'Modern React Flow for interactive node graphs.',
  },
  {
    icon: '🧭',
    label: 'React Router DOM v7',
    description: 'Client-side routing with nested routes.',
  },
  {
    icon: '🎨',
    label: 'Plain CSS',
    description: 'No preprocessors — just clean, scoped stylesheets.',
  },
];

export default HomePage;
