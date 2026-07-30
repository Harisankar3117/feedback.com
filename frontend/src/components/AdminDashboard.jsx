import React, { useEffect, useState } from 'react';
import { BarChart3, Download, RefreshCw, Users, Star, Smile, Search, LogOut } from 'lucide-react';

export default function AdminDashboard({ onLogout, adminKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/stats?admin_key=${encodeURIComponent(adminKey || '')}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data);
      } else {
        setError(data.message || 'Failed to load analytics.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    window.open(`/api/admin/export?admin_key=${encodeURIComponent(adminKey || '')}`, '_blank');
  };

  const filteredEntries = stats?.recentEntries?.filter((entry) => {
    const term = searchTerm.toLowerCase();
    return (
      (entry.name && entry.name.toLowerCase().includes(term)) ||
      (entry.department && entry.department.toLowerCase().includes(term)) ||
      (entry.comments && entry.comments.toLowerCase().includes(term)) ||
      (entry.emoji_rating && entry.emoji_rating.toLowerCase().includes(term))
    );
  }) || [];

  return (
    <div className="glass-card" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="admin-header">
        <div>
          <span className="badge-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
            Admin Insights & Analytics
          </span>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
            Networking Workshop Analytics
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn-secondary" onClick={fetchStats} title="Refresh Data">
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
          </button>
          <button type="button" className="btn-secondary" onClick={handleExportCSV} style={{ color: 'var(--accent)', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            <Download size={16} /> Export CSV
          </button>
          <button type="button" className="btn-secondary" onClick={onLogout} title="Exit Admin">
            <LogOut size={16} /> Exit
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '32px', height: '32px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Calculating real-time feedback metrics...</p>
        </div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)' }}>
                <Users size={18} />
                <span style={{ fontSize: '0.75rem' }}>Total</span>
              </div>
              <div className="metric-val">{stats.totalSubmissions}</div>
              <div className="metric-lbl">Submissions</div>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                <Star size={18} />
                <span style={{ fontSize: '0.75rem' }}>Out of 5.0</span>
              </div>
              <div className="metric-val" style={{ color: '#fbbf24' }}>
                {stats.averages.overall_score || 0}
              </div>
              <div className="metric-lbl">Overall Star Score</div>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)' }}>
                <Smile size={18} />
                <span style={{ fontSize: '0.75rem' }}>Top Emoji</span>
              </div>
              <div className="metric-val" style={{ fontSize: '1.4rem', marginTop: '0.6rem' }}>
                {stats.emojiDistribution.Excellent > stats.emojiDistribution.Good
                  ? '🤩 Excellent'
                  : stats.emojiDistribution.Good > 0
                  ? '😊 Good'
                  : '😐 Average'}
              </div>
              <div className="metric-lbl">Sentiment Lead</div>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <BarChart3 size={18} />
                <span style={{ fontSize: '0.75rem' }}>Clarity</span>
              </div>
              <div className="metric-val" style={{ color: '#10b981' }}>
                {stats.averages.teaching_clarity}
              </div>
              <div className="metric-lbl">Teaching Score</div>
            </div>
          </div>

          {/* Detailed Category Averages */}
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.8rem', border: '1px solid var(--input-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              📊 Category Performance Averages
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Content Quality', val: stats.averages.content_quality },
                { label: 'Teaching Clarity', val: stats.averages.teaching_clarity },
                { label: 'Interaction Level', val: stats.averages.interaction_level },
                { label: 'Overall Experience', val: stats.averages.overall_experience }
              ].map((cat) => (
                <div key={cat.label} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{cat.label}</span>
                    <span style={{ fontWeight: 700, color: '#fbbf24' }}>{cat.val} / 5</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(cat.val / 5) * 100}%`,
                        background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                        borderRadius: '3px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tags Frequency */}
          {Object.keys(stats.tagFrequencies).length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                🎯 Selected Feedback Tags Frequency
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(stats.tagFrequencies).map(([tag, count]) => (
                  <span key={tag} className="chip-tag selected" style={{ cursor: 'default' }}>
                    {tag} <span style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: '999px', fontSize: '0.75rem' }}>{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submissions Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                📝 Submissions Log ({filteredEntries.length})
              </h3>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-subtle)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search entries..."
                  style={{ paddingLeft: '2rem', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.8rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Student Name</th>
                    <th>College</th>
                    <th>Mobile</th>
                    <th>Dept & Year</th>
                    <th>Emoji Rating</th>
                    <th>Avg Star</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                        No submission records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((row) => {
                      const avg = (
                        (row.content_quality + row.teaching_clarity + row.interaction_level + row.overall_experience) / 4
                      ).toFixed(1);
                      return (
                        <tr key={row.id}>
                          <td style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                            {new Date(row.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td style={{ fontWeight: 600 }}>{row.name || 'Anonymous'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.college_name || '-'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.mobile_number || '-'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.department || '-'} {row.year || ''}</td>
                          <td>{row.emoji_rating}</td>
                          <td style={{ fontWeight: 700, color: '#fbbf24' }}>⭐ {avg}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.comments || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
