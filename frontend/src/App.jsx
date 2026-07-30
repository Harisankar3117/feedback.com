import React, { useState, useEffect } from 'react';
import PasswordScreen from './components/PasswordScreen';
import FeedbackForm from './components/FeedbackForm';
import ThankYouScreen from './components/ThankYouScreen';
import AdminDashboard from './components/AdminDashboard';
import { Lock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [authRole, setAuthRole] = useState(null); // null | 'student' | 'admin'
  const [adminKey, setAdminKey] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Ensure path matches /networking-workshop if user landed on home
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({}, '', '/networking-workshop');
      setCurrentPath('/networking-workshop');
    }

    // Check session storage for existing auth
    const savedRole = sessionStorage.getItem('feedback_auth_role');
    const savedKey = sessionStorage.getItem('feedback_admin_key');
    if (savedRole) {
      setAuthRole(savedRole);
      setAdminKey(savedKey);
    }

    // Check if user already submitted feedback in local storage
    const savedSubmission = localStorage.getItem('networking_workshop_submitted');
    if (savedSubmission) {
      try {
        setSubmittedData(JSON.parse(savedSubmission));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleAuthenticate = (role, key) => {
    setAuthRole(role);
    setAdminKey(key);
    sessionStorage.setItem('feedback_auth_role', role);
    if (key) sessionStorage.setItem('feedback_admin_key', key);
  };

  const handleSubmitSuccess = (data) => {
    setSubmittedData(data);
    localStorage.setItem('networking_workshop_submitted', JSON.stringify(data));
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    localStorage.removeItem('networking_workshop_submitted');
  };

  const handleLogout = () => {
    setAuthRole(null);
    setAdminKey(null);
    sessionStorage.removeItem('feedback_auth_role');
    sessionStorage.removeItem('feedback_admin_key');
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Top Header Navigation bar */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '0 0.5rem',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.jpg" alt="KSRCE Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>
            K.S.R. College of Engineering
          </span>
        </div>

        <div style={{ position: 'absolute', right: '0.5rem' }}>
          {authRole && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLogout}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              <Lock size={13} /> Lock Session
            </button>
          )}
        </div>
      </header>

      {/* Main View Router */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!authRole ? (
          <PasswordScreen onAuthenticate={handleAuthenticate} />
        ) : authRole === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} adminKey={adminKey} />
        ) : submittedData ? (
          <ThankYouScreen submissionData={submittedData} onReset={handleResetForm} />
        ) : (
          <FeedbackForm onSubmitSuccess={handleSubmitSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
        <p>© 2026 Computer Networking Workshop • Department of ECE</p>

      </footer>
    </div>
  );
}
