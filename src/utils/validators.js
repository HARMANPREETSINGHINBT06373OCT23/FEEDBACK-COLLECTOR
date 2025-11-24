/**
 * isEmailValid() to esnure the validity of the email.
 * ----------------
 * Simple helps function to validate an email address.
 * Uses a basic regular expression to ensure that the format:
 *   - Some characters are  before '@'
 *   - Domain name is  after '@'
 *   - A dot (.) followed by  valid extension
 *
 * @param {string} email - The email string to validate
 * @returns {boolean} true if email is in a valid format
 */
export function isEmailValid(email) {
  // Basic regex check for typical email patterns
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
