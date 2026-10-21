
import { Link } from "react-router-dom";
import "./homePage.css";

const features = [
  {
    icon: "▦",
    title: "Smart Inventory",
    description: "Manage products, batches and stock levels with ease.",
    color: "green",
  },
  {
    icon: "↗",
    title: "Fast POS Billing",
    description: "Create orders and handle sales efficiently.",
    color: "blue",
  },
  {
    icon: "✓",
    title: "Secure Role Access",
    description: "Dedicated access for Admins, Cashiers and Employees.",
    color: "teal",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link
          to="/"
          className="landing-logo"
          aria-label="Sethro Pharmacy home"
        >
          <img src="/Medical%20Logo.png" alt="Sethro Pharmacy" />
        </Link>

        <Link to="/login" className="landing-login">
          <span>Login</span>
          <span className="login-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      </header>

      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-label">
            <span className="hero-label-dot" />
            PHARMACY MANAGEMENT SYSTEM
          </div>

          <h1>
            A smarter way
            <br />
            to manage your
            <br />
            <span>pharmacy.</span>
          </h1>

          <p className="hero-description">
            Manage sales, inventory, purchases and your team — all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="get-started-button">
              Get Started
              <span aria-hidden="true">→</span>
            </Link>

            <a href="#features" className="explore-button">
              Explore features
              <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="hero-assurance">
            <span className="assurance-check">✓</span>
            <span>Simple to use</span>
            <span className="assurance-separator">·</span>
            <span>Built for pharmacy workflows</span>
          </div>
        </div>

        <div className="hero-dashboard">
          <div className="dashboard-glow" />
          <div className="dashboard-dots" />

          <img
            className="dashboard-image"
            src="/Sethro%20Pharmacy%20Dashboard%20Overview.png"
            alt="Sethro Pharmacy dashboard overview with sales, products, inventory and transactions"
            fetchPriority="high"
          />

          <div className="dashboard-floating-card">
            <span className="floating-check">✓</span>

            <span className="floating-card-text">
              <strong>All in one place</strong>
              <small>One system, smoother workflow</small>
            </span>
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        {features.map((feature) => (
          <article className="landing-feature" key={feature.title}>
            <div className={`landing-feature-icon ${feature.color}`}>
              {feature.icon}
            </div>

            <div className="landing-feature-content">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <img src="/Medical%20Logo.png" alt="" />
          <span>Sethro Pharmacy</span>
        </div>

        <p>Pharmacy management, made simpler.</p>
      </footer>
    </main>
  );
}
