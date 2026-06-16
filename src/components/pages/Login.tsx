const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <>
      <style>{`
        .login-root {
          font-family: 'Arimo', sans-serif;
          min-height: 100vh;
          display: flex;
        }

        /* Left — Intro */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          background: #f5f5f5;
        }

        .login-left-wordmark {
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 48px;
        }

        .login-left h2 {
          font-size: 32px;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.35;
          margin: 0 0 20px;
          max-width: 420px;
        }

        .login-left p {
          font-size: 14px;
          font-weight: 300;
          color: #888;
          line-height: 1.7;
          max-width: 400px;
          margin: 0;
        }

        .login-features {
          display: flex;
          gap: 32px;
          margin-top: 48px;
        }

        .login-feature-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-feature-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #bbb;
        }

        .login-feature-value {
          font-size: 13px;
          font-weight: 400;
          color: #555;
        }

        /* Right — Login form */
        .login-right {
          width: 480px;
          min-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: #fff;
          border-left: 1px solid #eee;
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          border: 1px solid #e8e8e5;
          border-radius: 12px;
          padding: 32px 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .login-heading {
          font-size: 22px;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }

        .login-sub {
          font-size: 13px;
          color: #999;
          font-weight: 300;
          margin: 0 0 18px;
        }

        .login-divider {
          height: 1px;
          background: #e8e8e5;
          margin-bottom: 28px;
        }

        .google-btn {
          all: unset;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          border: 1px solid #e2e2df;
          border-radius: 6px;
          background: #fff;
          color: #333;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.01em;
          box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .google-btn:hover {
          border-color: #c8c8c4;
          background: #fafaf9;
        }

        .google-btn:active {
          background: #f3f3f1;
        }

        .google-btn svg {
          flex-shrink: 0;
        }

        .login-terms {
          font-size: 11px;
          color: #bbb;
          margin-top: 5px;
          line-height: 1.6;
        }

        .login-terms a {
          color: #999;
          text-decoration: none;
          border-bottom: 1px solid #ddd;
        }

        .login-version {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #ccc;
          letter-spacing: 0.1em;
          margin-top: 48px;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right {
            width: 100%;
            min-width: unset;
            border-left: none;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Left — Introduction */}
        <div className="login-left">
          <p className="login-left-wordmark">GTFS Tool</p>

          <h2>plan and export transit data to GTFS</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </p>

          {/* <div className="login-features">
            <div className="login-feature-item">
              <span className="login-feature-label">stops</span>
              <span className="login-feature-value">map-based editor</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-label">routes</span>
              <span className="login-feature-value">visual path drawing</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-label">export</span>
              <span className="login-feature-value">one-click GTFS</span>
            </div>
          </div> */}
        </div>

        {/* Right — Login Form */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-heading">sign in</h1>
            <p className="login-sub">continue to your workspace</p>

            <div className="login-divider" />

            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              continue with Google
            </button>

            <p className="login-terms">
              by signing in you agree to our{' '}
              <a href="#">terms of service</a>
            </p>

            {/* <p className="login-version">v1.0.0</p> */}
          </div>
        </div>
      </div>
    </>
  );
}