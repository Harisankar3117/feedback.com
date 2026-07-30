import React, { useEffect } from 'react';
import { CheckCircle2, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYouScreen({ submissionData, onReset }) {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const overallScore = submissionData
    ? (
        (submissionData.content_quality +
          submissionData.teaching_clarity +
          submissionData.interaction_level +
          submissionData.overall_experience) /
        4
      ).toFixed(1)
    : '5.0';

  return (
    <div className="glass-card access-container" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div
        className="icon-badge"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          color: '#10b981'
        }}
      >
        <CheckCircle2 size={36} />
      </div>

      <span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        Feedback Recorded
      </span>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.8rem' }}>
        Thank You for Your Feedback!
      </h1>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '500px', marginTop: '0.5rem' }}>
        Your valuable input has been stored securely. We appreciate your active participation in the Computer Networking Workshop!
      </p>

      {submissionData && (
        <div
          style={{
            margin: '2rem 0',
            padding: '1.25rem',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={16} /> Submission Summary
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-subtle)' }}>Experience Rating:</span>
              <div style={{ fontWeight: 600, color: '#fff' }}>{submissionData.emoji_rating || 'N/A'}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-subtle)' }}>Average Star Rating:</span>
              <div style={{ fontWeight: 600, color: '#fbbf24' }}>⭐ {overallScore} / 5.0</div>
            </div>

            {submissionData.department && (
              <div>
                <span style={{ color: 'var(--text-subtle)' }}>Department / Year:</span>
                <div style={{ fontWeight: 600, color: '#fff' }}>{submissionData.department}</div>
              </div>
            )}

            {submissionData.quick_feedback_tags && submissionData.quick_feedback_tags.length > 0 && (
              <div>
                <span style={{ color: 'var(--text-subtle)' }}>Tags Selected:</span>
                <div style={{ fontWeight: 600, color: '#fff' }}>{submissionData.quick_feedback_tags.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
        <button type="button" className="btn-secondary" onClick={onReset}>
          <RotateCcw size={16} /> Submit Another Response
        </button>
      </div>

      <div style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        Made with <Heart size={14} fill="#f43f5e" stroke="none" /> for ECE Students
      </div>
    </div>
  );
}
