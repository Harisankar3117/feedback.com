const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to get passcodes from MySQL
async function getPasscodes() {
  const [rows] = await pool.query('SELECT access_password, admin_password FROM settings LIMIT 1');
  if (rows.length > 0) {
    return {
      ACCESS_PASSWORD: rows[0].access_password,
      ADMIN_PASSWORD: rows[0].admin_password
    };
  }
  return { ACCESS_PASSWORD: '', ADMIN_PASSWORD: '' };
}

// 1. Password verification endpoint
app.post('/api/verify-password', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  try {
    const { ACCESS_PASSWORD, ADMIN_PASSWORD } = await getPasscodes();

    if (password === ACCESS_PASSWORD) {
      return res.json({ success: true, role: 'student' });
    } else if (password === ADMIN_PASSWORD) {
      return res.json({ success: true, role: 'admin' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }
  } catch (err) {
    console.error('Database error during verification:', err);
    return res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

// 2. Submit Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  const {
    name,
    department,
    year,
    college_name,
    mobile_number,
    student_mail,
    emoji_rating,
    content_quality,
    teaching_clarity,
    interaction_level,
    overall_experience,
    quick_feedback_tags,
    comments
  } = req.body;

  // Validation: Emoji & star ratings are mandatory
  if (!emoji_rating || !content_quality || !teaching_clarity || !interaction_level || !overall_experience) {
    return res.status(400).json({ success: false, message: 'Please complete all required ratings.' });
  }

  const tagsJson = Array.isArray(quick_feedback_tags) ? JSON.stringify(quick_feedback_tags) : JSON.stringify([]);

  const sql = `
    INSERT INTO feedback (
      name, department, year, college_name, mobile_number, student_mail, emoji_rating, content_quality, teaching_clarity, interaction_level, overall_experience, quick_feedback_tags, comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [
      name || 'Anonymous Student',
      department || 'Unspecified',
      year || 'Unspecified',
      college_name || 'Unspecified',
      mobile_number || 'Unspecified',
      student_mail || 'Unspecified',
      emoji_rating,
      parseInt(content_quality, 10),
      parseInt(teaching_clarity, 10),
      parseInt(interaction_level, 10),
      parseInt(overall_experience, 10),
      tagsJson,
      comments || ''
    ]);

    res.json({
      success: true,
      message: 'Feedback submitted successfully!',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error inserting feedback:', err);
    return res.status(500).json({ success: false, message: 'Failed to record feedback in database.' });
  }
});

// 3. Admin Analytics Endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const { ADMIN_PASSWORD } = await getPasscodes();
    const authHeader = req.headers['authorization'];
    
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}` && req.query.admin_key !== ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin access.' });
    }

    const [rows] = await pool.query(`SELECT * FROM feedback ORDER BY timestamp DESC`);
    const totalSubmissions = rows.length;

    if (totalSubmissions === 0) {
      return res.json({
        success: true,
        totalSubmissions: 0,
        averages: {
          content_quality: 0,
          teaching_clarity: 0,
          interaction_level: 0,
          overall_experience: 0,
          overall_score: 0
        },
        emojiDistribution: { Poor: 0, Average: 0, Good: 0, Excellent: 0 },
        tagFrequencies: {},
        recentEntries: []
      });
    }

    // Calculate Averages
    let totalContent = 0;
    let totalTeaching = 0;
    let totalInteraction = 0;
    let totalOverall = 0;

    const emojiCounts = { Poor: 0, Average: 0, Good: 0, Excellent: 0 };
    const tagCounts = {};

    rows.forEach(row => {
      totalContent += row.content_quality || 0;
      totalTeaching += row.teaching_clarity || 0;
      totalInteraction += row.interaction_level || 0;
      totalOverall += row.overall_experience || 0;

      // Emoji count mapping
      if (row.emoji_rating) {
        if (row.emoji_rating.includes('Poor') || row.emoji_rating.includes('😡')) emojiCounts.Poor++;
        else if (row.emoji_rating.includes('Average') || row.emoji_rating.includes('😐')) emojiCounts.Average++;
        else if (row.emoji_rating.includes('Good') || row.emoji_rating.includes('😊')) emojiCounts.Good++;
        else if (row.emoji_rating.includes('Excellent') || row.emoji_rating.includes('🤩')) emojiCounts.Excellent++;
      }

      // Tags count mapping
      try {
        const tags = JSON.parse(row.quick_feedback_tags || '[]');
        if (Array.isArray(tags)) {
          tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      } catch (e) {
        // ignore parse error
      }
    });

    const avgContent = parseFloat((totalContent / totalSubmissions).toFixed(2));
    const avgTeaching = parseFloat((totalTeaching / totalSubmissions).toFixed(2));
    const avgInteraction = parseFloat((totalInteraction / totalSubmissions).toFixed(2));
    const avgOverall = parseFloat((totalOverall / totalSubmissions).toFixed(2));
    const grandAvg = parseFloat(((avgContent + avgTeaching + avgInteraction + avgOverall) / 4).toFixed(2));

    res.json({
      success: true,
      totalSubmissions,
      averages: {
        content_quality: avgContent,
        teaching_clarity: avgTeaching,
        interaction_level: avgInteraction,
        overall_experience: avgOverall,
        overall_score: grandAvg
      },
      emojiDistribution: emojiCounts,
      tagFrequencies: tagCounts,
      recentEntries: rows
    });
  } catch (err) {
    console.error('Error fetching feedback stats:', err);
    return res.status(500).json({ success: false, message: 'Database query failed.' });
  }
});

// 4. CSV Export Endpoint
app.get('/api/admin/export', async (req, res) => {
  try {
    const { ADMIN_PASSWORD } = await getPasscodes();
    
    if (req.query.admin_key !== ADMIN_PASSWORD) {
      return res.status(403).send('Unauthorized');
    }

    const [rows] = await pool.query(`SELECT * FROM feedback ORDER BY timestamp DESC`);

    let csvContent = 'Submission ID,Timestamp,Name,College Name,Mobile Number,Email,Department,Year,Emoji Rating,Content Quality,Teaching Clarity,Interaction Level,Overall Experience,Quick Tags,Comments\n';
    
    rows.forEach(row => {
      let tagsStr = '';
      try {
        tagsStr = JSON.parse(row.quick_feedback_tags || '[]').join('; ');
      } catch (e) {
        tagsStr = row.quick_feedback_tags || '';
      }
      
      const cleanComments = (row.comments || '').replace(/"/g, '""').replace(/\n/g, ' ');

      csvContent += `${row.id},"${row.timestamp}","${row.name || ''}","${row.college_name || ''}","${row.mobile_number || ''}","${row.student_mail || ''}","${row.department || ''}","${row.year || ''}","${row.emoji_rating || ''}",${row.content_quality},${row.teaching_clarity},${row.interaction_level},${row.overall_experience},"${tagsStr}","${cleanComments}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="networking_workshop_feedback.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    console.error('Error in export:', err);
    return res.status(500).send('Database Error');
  }
});

// 5. Delete Feedback Endpoint
app.delete('/api/admin/feedback/:id', async (req, res) => {
  try {
    const { ADMIN_PASSWORD } = await getPasscodes();
    const authHeader = req.headers['authorization'];
    
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}` && req.query.admin_key !== ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin access.' });
    }

    const feedbackId = req.params.id;
    const [result] = await pool.query('DELETE FROM feedback WHERE id = ?', [feedbackId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }

    res.json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    return res.status(500).json({ success: false, message: 'Database Error' });
  }
});

// Serve frontend static files if in production build
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
