import React from 'react';
import { Check, Plus } from 'lucide-react';

const DEFAULT_TAGS = [
  'Very Informative',
  'Need More Practical',
  'Too Fast',
  'Well Explained',
  'Great Hands-on Labs',
  'Clear Slides & Material'
];

export default function TagSelector({ selectedTags, onToggleTag }) {
  return (
    <div className="tags-grid">
      {DEFAULT_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            className={`chip-tag ${isSelected ? 'selected' : ''}`}
            onClick={() => onToggleTag(tag)}
          >
            {isSelected ? <Check size={14} /> : <Plus size={14} />}
            <span>{tag}</span>
          </button>
        );
      })}
    </div>
  );
}
