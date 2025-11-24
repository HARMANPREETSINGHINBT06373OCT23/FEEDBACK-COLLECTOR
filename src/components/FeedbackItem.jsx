import React, { useState } from 'react';
import ModalComponent from './ModalComponent';

/**
 * FeedbackItem Component
 * ----------------------
 * Renders a single feedback entry inside the list.
 * Also handles the delete workflow using a two-step confirmation:
 *    1. User clicks "Delete" → asks for confirmation
 *    2. User must type DELETE → final action
 *
 * @param {{ item: Object, onDelete: Function }} props
 */
export default function FeedbackItem({ item, onDelete }) {

  // Tracks which delete step is active:
  // 0 = none, 1 = confirm modal, 2 = type DELETE modal
  const [step, setStep] = useState(0);

  // Stores the user's DELETE input for final confirmation
  const [confirmText, setConfirmText] = useState('');

  /**
   * handleFinalDelete()
   * --------------------
   * Runs only when user is in Step 2 (typing DELETE).
   * - Verifies if the text exactly matches "DELETE"
   * - Calls parent delete handler on success
   * - Resets modal state afterward
   */
  const handleFinalDelete = () => {
    if (confirmText === 'DELETE') {
      onDelete(item.id);          // Inform parent component to remove the item
    } else {
      alert('Not deleted. You must type DELETE exactly.');
    }

    // Reset internal modal state
    setStep(0);
    setConfirmText('');
  };

  return (
    <li className="feedback-item border rounded p-4 mb-3 bg-white">
      {/* Header row: Name, email, timestamp, delete button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-gray-800">{item.name}</div>
          <div className="text-xs text-gray-500">{item.email}</div>

          {/* Show createdAt in a more readable format */}
          <div className="text-xs text-gray-400 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Opens Step 1 of delete process */}
        <div>
          <button
            onClick={() => setStep(1)}
            className="bg-red-500 text-white text-sm px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Feedback message body */}
      <div className="mt-3 text-gray-800">{item.message}</div>

      {/* ------------------ STEP 1: Confirm Yes/No ------------------ */}
      {step === 1 && (
        <ModalComponent title="Confirm deletion" onClose={() => setStep(0)}>
          <p>Are you sure you want to delete this feedback?</p>

          <div className="mt-3 flex justify-end gap-2">
            {/* Cancel → closes modal */}
            <button
              onClick={() => setStep(0)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            {/* Proceed to Step 2 → type DELETE */}
            <button
              onClick={() => setStep(2)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Yes, Delete
            </button>
          </div>
        </ModalComponent>
      )}

      {/* ------------------ STEP 2: Type DELETE ------------------ */}
      {step === 2 && (
        <ModalComponent title="Type DELETE to Confirm" onClose={() => setStep(0)}>
          <p>
            Please type <strong>DELETE</strong> to permanently delete this feedback.
          </p>

          {/* Text input for DELETE confirmation */}
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full border rounded px-3 py-2 mt-3"
          />

          <div className="mt-3 flex justify-end gap-2">
            {/* Back to normal → close modal */}
            <button
              onClick={() => setStep(0)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            {/* Only deletes if typed DELETE correctly */}
            <button
              onClick={handleFinalDelete}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </ModalComponent>
      )}
    </li>
  );
}
