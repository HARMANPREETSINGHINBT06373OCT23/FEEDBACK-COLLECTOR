import React, { useState } from 'react';
import { isEmailValid } from '../utils/validators';

/**
 * FeedbackForm Component
 * -----------------------
 * Collects basic feedback information from the user:
 * - Name
 * - Email
 * - Message
 *
 * The component validates user input before forwarding
 * the data to the parent via the onAdd() callback.
 *
 * @param {{ onAdd: function }} props
 */
export default function FeedbackForm({ onAdd }) {
  // Local state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Holds validation errors for the UI
  const [error, setError] = useState('');
// Tracks whether the user has attempted to submit the form
  // Used to display conditional red asterisks (*) on empty fields
  const [submitted, setSubmitted] = useState(false);


  /**
   * handleSubmit()
   * ----------------
   * Triggered when user submits the form.
   * - Prevents default page reload
   * - Validates required fields
   * - Validates email format
   * - Sends cleaned data to parent
   * - Resets form on success
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    // Basic empty-field check
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('All fields are required.');
      return;
    }

    // Validate email format using helper method
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Create a clean payload to send to parent
    const payload = { 
      name: name.trim(), 
      email: email.trim(), 
      message: message.trim() 
    };

    // Send data to parent component
    onAdd(payload);

    // Reset form fields after successful submission
    setName('');
    setEmail('');
    setMessage('');
  };

  // Render the form UI
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Feedback Form
      </h2>

      {/* Display validation errors */}
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3
                        dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Name Input */}
      <label className="block text-sm mb-1 text-gray-800 dark:text-gray-300">
  Name 
  {submitted && !name.trim() && (
    <span className="text-red-600"> *</span>
  )}
</label>
 <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3 focus:outline-none
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      />

      {/* Email Input */}
      <label className="block text-sm mb-1 text-gray-800 dark:text-gray-300">
  Email 
  {submitted && !email.trim() && (
    <span className="text-red-600"> *</span>
  )}
</label>

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3 focus:outline-none
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      />

      {/* Message Textarea */}
      <label className="block text-sm mb-1 text-gray-800 dark:text-gray-300">
  Message 
  {submitted && !message.trim() && (
    <span className="text-red-600"> *</span>
  )}
</label>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={5}
        className="w-full border rounded px-3 py-2 mb-3 focus:outline-none
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      />

      {/* Submit Button */}
      <div className="flex items-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
