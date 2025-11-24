// LocalStorage key used to persist feedback entries
const STORAGE_KEY = 'feedbacks_v1';

/**
 * generateId()
 * ------------
 * Generates a simple unique ID for each feedback entry.
 * Sufficient for localStorage-based apps.
 */
function generateId() {
  return 'id-' + Math.random().toString(36).slice(2, 9);
}

const FeedbackService = {

  /**
   * getAll()
   * --------
   * Reads all feedback entries from localStorage  only
   * Safely parses JSON
   * Returns newest feedback first i.e sorted by createdAt
   */
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      // Sort entries by datetime (newest first)
      return parsed.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (err) {
      console.error('Failed to read feedbacks', err);
      return [];
    }
  },

  /**
   * add(data)
   
   * Adds a new feedback entry to localStorage.
   *  Builds a clean entry object
   *  Generates unique ID & timestamp
   *  Stores updated array back to localStorage
   */
  add(data) {
    const all = this.getAll();

    const entry = {
      id: generateId(),
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    // Insert new entry at the top
    all.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return entry;
  },

  /**
   * remove(id)
   * 
   * Deletes a feedback entry by ID.
   *  Filters out the entry
   * Saves updated list back to localStorage
   */
  remove(id) {
    const all = this.getAll().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
};

export default FeedbackService;
