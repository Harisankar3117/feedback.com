import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';

export default function PasswordScreen({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the workshop passcode.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onAuthenticate(data.role || 'student', password.trim());
      } else {
        setError(data.message || 'Incorrect passcode. Please verify and try again.');
      }
    } catch (err) {
      // Fallback check if server offline during dev
      if (password.trim() === 'KSRCE@CN') {
        onAuthenticate('student', password.trim());
      } else if (password.trim() === 'KINGMAHENDRAN') {
        onAuthenticate('admin', password.trim());
      } else {
        setError('Incorrect passcode. Please verify and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card access-container">
      <div className="icon-badge">
        <KeyRound size={32} />
      </div>

      <div style={{ marginBottom: '1.8rem' }}>
        <span className="badge-tag">Restricted Workshop Access</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.6rem', color: '#ffffff' }}>
          Computer Networking Workshop
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
          Please enter the session passcode provided by your instructor to access the feedback form.
        </p>
      </div>

      {error && (
        <div className="alert-error" style={{ width: '100%' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="passcode-input">
            <Lock size={15} /> Event Passcode
          </label>
          <input
            id="passcode-input"
            type="password"
            className="form-input"
            placeholder="Enter passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              Access Feedback Form <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

    </div>
  );
}
