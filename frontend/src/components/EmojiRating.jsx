import React from 'react';

const EMOJI_OPTIONS = [
  { value: '😡 Poor', label: 'Poor', emoji: '😡', color: '#f43f5e' },
  { value: '😐 Average', label: 'Average', emoji: '😐', color: '#f59e0b' },
  { value: '😊 Good', label: 'Good', emoji: '😊', color: '#10b981' },
  { value: '🤩 Excellent', label: 'Excellent', emoji: '🤩', color: '#38bdf8' }
];

export default function EmojiRating({ selected, onSelect }) {
  return (
    <div className="emoji-grid">
      {EMOJI_OPTIONS.map((item) => {
        const isSelected = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            className={`emoji-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(item.value)}
            aria-label={`Rate as ${item.label}`}
          >
            <span className="emoji-icon">{item.emoji}</span>
            <span className="emoji-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
