import React, { useState } from 'react';
import { User, Building2, MessageSquare, Send, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import EmojiRating from './EmojiRating';
import StarRating from './StarRating';
import TagSelector from './TagSelector';

export default function FeedbackForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    college_name: '',
    mobile_number: '',
    student_mail: '',
    emoji_rating: '',
    content_quality: 0,
    teaching_clarity: 0,
    interaction_level: 0,
    overall_experience: 0,
    quick_feedback_tags: [],
    comments: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Validation logic
  const isStep1Valid = () => {
    if (!formData.name || !formData.college_name || !formData.department || !formData.year || !formData.mobile_number || !formData.student_mail) {
      return false; // All fields are required
    }
    if (!/^\d{10}$/.test(formData.mobile_number)) {
      return false; // Mobile must be 10 digits
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.student_mail)) {
      return false; // Basic email validation
    }
    return true;
  };

  const isFormValid =
    formData.emoji_rating !== '' &&
    formData.content_quality > 0 &&
    formData.teaching_clarity > 0 &&
    formData.interaction_level > 0 &&
    formData.overall_experience > 0 &&
    formData.comments.trim() !== '';

  const handleNext = (e) => {
    e.preventDefault();
    if (!isStep1Valid()) {
      setErrorMsg('Please fill out all fields completely, including a valid 10-digit mobile number and valid email address.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStep(1);
  };

  const handleToggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.quick_feedback_tags.includes(tag);
      return {
        ...prev,
        quick_feedback_tags: exists
          ? prev.quick_feedback_tags.filter((t) => t !== tag)
          : [...prev.quick_feedback_tags, tag]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg('Please select your overall emoji rating, rate all 4 categories, and provide detailed comments.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSubmitSuccess(formData);
      } else {
        setErrorMsg(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      // Offline fallback demo
      onSubmitSuccess(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card">
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span className="badge-tag">Step {step} of 2</span>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>• Workshop Feedback</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Computer Networking Workshop
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          {step === 1 ? 'Please enter your details below.' : 'Your honest insights help us improve future technical sessions.'}
        </p>
      </div>

      {errorMsg && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} /> Student Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-name">Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  id="student-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-college">College Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  id="student-college"
                  type="text"
                  className="form-input"
                  placeholder="e.g. KSRCE"
                  value={formData.college_name}
                  onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-dept">Department <span style={{ color: 'var(--error)' }}>*</span></label>
                <select
                  id="student-dept"
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science and Engineering (CSE)">Computer Science and Engineering (CSE)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                  <option value="Electronics and Communication Engineering (ECE)">Electronics and Communication Engineering (ECE)</option>
                  <option value="Electrical and Electronics Engineering (EEE)">Electrical and Electronics Engineering (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Artificial Intelligence and Data Science (AI&DS)">Artificial Intelligence and Data Science (AI&DS)</option>
                  <option value="Artificial Intelligence and Machine Learning (AI&ML)">Artificial Intelligence and Machine Learning (AI&ML)</option>
                  <option value="Bio-Medical Engineering">Bio-Medical Engineering</option>
                  <option value="Bio-Technology">Bio-Technology</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Automobile Engineering">Automobile Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-year">Year <span style={{ color: 'var(--error)' }}>*</span></label>
                <select
                  id="student-year"
                  className="form-select"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-mobile">Mobile Number <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  id="student-mobile"
                  type="tel"
                  className="form-input"
                  placeholder="10-digit number"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="student-mail">Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  id="student-mail"
                  type="email"
                  className="form-input"
                  placeholder="e.g. name@example.com"
                  value={formData.student_mail}
                  onChange={(e) => setFormData({ ...formData, student_mail: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Next <ArrowRight size={18} />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {/* B. Emoji Rating (Main Experience Rating) */}
          <div>
            <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.6rem', color: '#ffffff' }}>
              <Sparkles size={18} style={{ color: 'var(--accent)' }} /> How would you rate the overall workshop experience? <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <EmojiRating
              selected={formData.emoji_rating}
              onSelect={(val) => setFormData({ ...formData, emoji_rating: val })}
            />
          </div>

          {/* C. Category Ratings (Star Rating System 1-5) */}
          <div>
            <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.8rem', color: '#ffffff' }}>
              ⭐ Category Ratings <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <div className="ratings-container">
              <StarRating
                title="Content Quality"
                subtitle="Relevance & depth of computer networking concepts"
                rating={formData.content_quality}
                onChange={(val) => setFormData({ ...formData, content_quality: val })}
              />
              <StarRating
                title="Teaching Clarity"
                subtitle="Explanation of protocols, architectures & topics"
                rating={formData.teaching_clarity}
                onChange={(val) => setFormData({ ...formData, teaching_clarity: val })}
              />
              <StarRating
                title="Interaction Level"
                subtitle="Q&A session, hands-on engagement & instructor support"
                rating={formData.interaction_level}
                onChange={(val) => setFormData({ ...formData, interaction_level: val })}
              />
              <StarRating
                title="Overall Experience"
                subtitle="Overall organization and value of the workshop"
                rating={formData.overall_experience}
                onChange={(val) => setFormData({ ...formData, overall_experience: val })}
              />
            </div>
          </div>

          {/* D. Quick Feedback Buttons (Multi-select chips) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              🎯 Quick Feedback Tags <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>(Select all that apply)</span>
            </label>
            <TagSelector
              selectedTags={formData.quick_feedback_tags}
              onToggleTag={handleToggleTag}
            />
          </div>

          {/* E. Detailed Feedback Textarea */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" htmlFor="detailed-comments" style={{ marginBottom: 0 }}>
                <MessageSquare size={16} /> Detailed Comments & Suggestions <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {formData.comments.length} / 500
              </span>
            </div>
            <textarea
              id="detailed-comments"
              className="form-textarea"
              rows="4"
              maxLength="500"
              placeholder="Share specific key takeaways, topics you'd like to explore next, or suggestions for improvement..."
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            ></textarea>
          </div>

          {/* F. Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={handleBack} style={{ flex: 1 }}>
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isFormValid || submitting}
              style={{ flex: 2 }}
            >
              {submitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Submit Feedback <Send size={18} />
                </>
              )}
            </button>
          </div>

          {!isFormValid && (
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '-0.8rem' }}>
              Please select an emoji, rate all 4 categories, and provide comments to enable submission.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
