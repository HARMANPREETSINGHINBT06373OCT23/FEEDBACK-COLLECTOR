import React from 'react';
import FeedbackItem from './FeedbackItem';

/**
 * FeedbackList Component
 * -----------------------
 * Renders a list of feedback entries using FeedbackItem.
 * - Displays a simple fallback message when the list is empty
 * - Accepts "compact" mode for flexible layout styling
 *
 * @param {{ items: Array, onDelete: Function, compact: boolean }} props
 */
export default function FeedbackList({ items = [], onDelete, compact }) {

  // If there are no feedback items, show a simple placeholder message
  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-500">No feedback entries found.</div>;
  }

  // Render feedback items in a list
  // When compact=false → uses grid layout
  // When compact=true → plain list (minimal spacing)
  return (
    <ul className={compact ? "" : "grid grid-cols-1 gap-4"}>
      {items.map(item => (
        // FeedbackItem handles its own UI + deletion workflow
        <FeedbackItem 
          key={item.id} 
          item={item} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
}
