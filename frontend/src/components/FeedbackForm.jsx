import React, { useState } from 'react';
import { User, Building2, MessageSquare, Send, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import EmojiRating from './EmojiRating';

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
    q2_confidence: '',
    q3_valuable_lab: '',
    q4_least_clear: '',
    q5_balance: '',
    q6_instructor: '',
    q7_equipment: '',
    q8_recommend: '',
    q9_skill: '',
    q10_advanced_topics: [],
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
    formData.q2_confidence !== '' &&
    formData.q3_valuable_lab !== '' &&
    formData.q4_least_clear.trim() !== '' &&
    formData.q5_balance !== '' &&
    formData.q6_instructor !== '' &&
    formData.q7_equipment !== '' &&
    formData.q8_recommend !== '' &&
    formData.q9_skill.trim() !== '' &&
    formData.q10_advanced_topics.length > 0 &&
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

  const handleToggleTopic = (topic) => {
    setFormData((prev) => {
      const exists = prev.q10_advanced_topics.includes(topic);
      let newTopics = exists
        ? prev.q10_advanced_topics.filter((t) => t !== topic)
        : [...prev.q10_advanced_topics, topic];
      
      // Limit to max 2
      if (newTopics.length > 2) {
        newTopics = newTopics.slice(1);
      }
      return { ...prev, q10_advanced_topics: newTopics };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg('Please answer all required questions before submitting.');
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

          {/* New Custom Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Q2 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                2. How confident do you now feel in your ability to cable, configure, and integrate switches, routers, and access points? <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Not Confident', 'Slightly Confident', 'Neutral', 'Confident', 'Very Confident'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="q2_confidence" value={opt} checked={formData.q2_confidence === opt} onChange={(e) => setFormData({...formData, q2_confidence: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                3. Which hands-on lab did you find MOST valuable? (Select one) <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Cable crimping & testing', 'Switch configuration (VLANs, Port Security)', 'Router configuration (Interfaces, Static Routes)', 'Access Point setup (SSID, Security)', 'Integrated network troubleshooting'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="q3_valuable_lab" value={opt} checked={formData.q3_valuable_lab === opt} onChange={(e) => setFormData({...formData, q3_valuable_lab: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                4. Which topic or lab did you find LEAST clear or could be improved? <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input type="text" className="form-input" placeholder="Your answer" value={formData.q4_least_clear} onChange={(e) => setFormData({...formData, q4_least_clear: e.target.value})} />
            </div>

            {/* Q5 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                5. The balance between lecture time and hands-on lab time was: <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Too much lecture, not enough lab', 'Just right', 'Too much lab, not enough lecture'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="q5_balance" value={opt} checked={formData.q5_balance === opt} onChange={(e) => setFormData({...formData, q5_balance: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q6 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                6. The instructor's ability to explain complex networking concepts clearly was: <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Poor', 'Fair', 'Good', 'Excellent'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="q6_instructor" value={opt} checked={formData.q6_instructor === opt} onChange={(e) => setFormData({...formData, q6_instructor: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q7 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                7. Was the provided lab equipment (hardware, cables) sufficient and functional for all activities? <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Yes, everything worked well.', 'Mostly, but there were some minor issues.', 'No, there were significant problems that hindered learning.'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="q7_equipment" value={opt} checked={formData.q7_equipment === opt} onChange={(e) => setFormData({...formData, q7_equipment: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q8 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                8. Based on this bootcamp, how likely are you to recommend this training to a friend or colleague? <span style={{ color: 'var(--error)' }}>*</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'inherit' }}>(0 = Not at all likely, 5 = Extremely likely)</div>
              </label>
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', color: 'var(--text-main)' }}>
                {['0', '1', '2', '3', '4', '5'].map(opt => (
                  <label key={opt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.85rem' }}>{opt}</span>
                    <input type="radio" name="q8_recommend" value={opt} checked={formData.q8_recommend === opt} onChange={(e) => setFormData({...formData, q8_recommend: e.target.value})} style={{ accentColor: 'var(--accent)' }} />
                  </label>
                ))}
              </div>
            </div>

            {/* Q9 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                9. What is one specific skill you learned this week that you are most excited to apply? <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input type="text" className="form-input" placeholder="Your answer" value={formData.q9_skill} onChange={(e) => setFormData({...formData, q9_skill: e.target.value})} />
            </div>

            {/* Q10 */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#ffffff', marginBottom: '0.8rem', fontFamily: 'Times New Roman, serif', fontSize: '1rem', lineHeight: '1.6' }}>
                10. Which of these advanced topics would you be most interested in for a future session? (Select your top 2) <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-main)' }}>
                {['Network Security (Firewalls, ACLs)', 'Dynamic Routing (OSPF, EIGRP)', 'Advanced Switching (STP, EtherChannel)', 'Wireless Networking (Enterprise)', 'Network Automation'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.q10_advanced_topics.includes(opt)} onChange={() => handleToggleTopic(opt)} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            
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
              Please answer all required questions to enable submission.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
