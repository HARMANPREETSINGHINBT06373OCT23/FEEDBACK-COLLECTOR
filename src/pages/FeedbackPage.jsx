// src/pages/FeedbackPage.jsx
import React, { useEffect, useState, useRef } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import FeedbackService from "../services/feedback-service";
import ModalComponent from "../components/ModalComponent";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import titleIcon from "../assets/icons/icon.png";
import searchIcon from "../assets/icons/search.png";


/**
 * FeedbackPage.jsx
 *  Full slider (autoplay + pause on hover + prev/next)
 *  2-step deletion confirmation: Step1 confirm, Step2 type DELETE
 *  Keeps add/search/theme logic intact
 */
export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [dark, setDark] = useState(false);



  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef(null);

  // Delete states (two-step)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteStep, setDeleteStep] = useState(0); // 0 none, 1 confirm, 2 type DELETE
  const [confirmText, setConfirmText] = useState("");

  // Load feedbacks once
  useEffect(() => {
    setFeedbacks(FeedbackService.getAll());
  }, []);

  // Add feedback (unchanged)
  const handleAddFeedback = (feedback) => {
    const created = FeedbackService.add(feedback);
    setFeedbacks((prev) => [created, ...prev]);
  };

  // Search logic (unchanged)
  const handleSearch = (e) => {
    e?.preventDefault();
    const keyword = filterText.trim().toLowerCase();

    if (!keyword && !startDate && !endDate) {
      setSearchResults([]);
      setSearchTriggered(true);
      return;
    }

    const results = feedbacks.filter((f) => {
      const matchesKeyword =
        !keyword ||
        f.name.toLowerCase().includes(keyword) ||
        f.email.toLowerCase().includes(keyword) ||
        f.message.toLowerCase().includes(keyword);

      const createdAt = new Date(f.createdAt).setHours(0, 0, 0, 0);
      let matchesDate = true;
      if (startDate) {
        const s = new Date(startDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && createdAt >= s;
      }
      if (endDate) {
        const e = new Date(endDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && createdAt <= e;
      }

      return matchesKeyword && matchesDate;
    });

    setSearchResults(results);
    setSearchTriggered(true);
  };

  // Slider: autoplay effect
  useEffect(() => {
    // clear any existing
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    if (paused || feedbacks.length === 0) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [paused, feedbacks]);

  // Prev / Next handlers
  const prevSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((p) => (p === 0 ? feedbacks.length - 1 : p - 1));
  };
  const nextSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((p) => (p === feedbacks.length - 1 ? 0 : p + 1));
  };

  // Open delete flow (Step 1)
  const triggerDeleteFlow = (id) => {
    setDeleteTarget(id);
    setDeleteStep(1);
  };

  // Perform final delete (after typing DELETE)
  const performDelete = () => {
    if (!deleteTarget) return;

    // remove from service
    FeedbackService.remove(deleteTarget);

    // update local state
    setFeedbacks((prev) => {
      const newList = prev.filter((f) => f.id !== deleteTarget);
      // adjust slider index to stay valid
      if (newList.length === 0) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex((idx) => Math.min(idx, newList.length - 1));
      }
      return newList;
    });

    // reset delete UI
    setDeleteTarget(null);
    setDeleteStep(0);
    setConfirmText("");
  };

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-6xl mx-auto p-4">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <div>
             <h1 className="text-3xl font-extrabold flex items-center gap-2">
  <img 
    src={titleIcon}
    alt="icon"
    className="w-8 h-8 object-contain"
  />
  Feedback Collector
</h1>
 <p className="text-sm text-gray-600 dark:text-gray-300">
               Collect, view and manage user feedback effortlessly.
</p>
            </div>

           <button
  onClick={() => setDark((d) => !d)}
  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
  aria-label="Toggle theme"
>
  {dark ? (
    <SunIcon className="h-6 w-6 text-yellow-300" />
  ) : (
    <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
  )}
</button>
</header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <FeedbackForm onAdd={handleAddFeedback} />
            </section>

            {/* Right: Filters + Search */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
              <form onSubmit={handleSearch} className="space-y-3">
               <div className="flex items-center justify-between gap-3 w-full">

  {/* Search Input */}
  <input
    placeholder="Search name, email or message"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="flex-1 px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
  />

  {/* Search Icon OUTSIDE, to the RIGHT */}
  <button type="submit" className="p-1">
    <img 
      src={searchIcon}
      alt="search"
      className="w-6 h-6 opacity-80 dark:invert cursor-pointer hover:opacity-100 transition"
    />
  </button>

</div>


               
                <div className="flex gap-3">
  <div className="w-full">
    <label className="block text-sm mb-1 text-gray-800 dark:text-gray-300">
      From
    </label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
    />
  </div>

  <div className="w-full">
    <label className="block text-sm mb-1 text-gray-800 dark:text-gray-300">
      To
    </label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
    />
  </div>
</div>

                <button className="px-4 py-2 bg-indigo-600 text-white rounded"> Search</button>
              </form>

              {searchTriggered && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                  {searchResults.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">No matching feedback found.</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {searchResults.map((f) => (
                        <div key={f.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">{f.name}</div>
                              <div className="text-xs">{f.email}</div>
                            </div>
                            <div className="text-xs">{new Date(f.createdAt).toLocaleString()}</div>
                          </div>
                          <p className="mt-2">{f.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Slider section (full width below) */}
            <section className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Feedbacks ({feedbacks.length})</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaused((p) => !p)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    {paused ? "Resume" : "Pause"}
                  </button>
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No feedback yet.</div>
              ) : (
                <div
                  className="relative overflow-hidden rounded-xl border dark:border-gray-700"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  {/* sliding track */}
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {feedbacks.map((f) => (
                      <div key={f.id} className="min-w-full p-6 bg-white/60 dark:bg-gray-700/60">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg">{f.name}</div>
                            <div className="text-xs text-gray-500">{f.email}</div>
                          </div>
                          <div className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleString()}</div>
                        </div>

                        <p className="mt-4 text-gray-800 dark:text-gray-100">{f.message}</p>

                        <div className="mt-4 flex gap-2">
                          {/* open two-step delete flow */}
                          <button
                            onClick={() => {
                              setDeleteTarget(f.id);
                              setDeleteStep(1);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Prev/Next */}
                  <button
                    onClick={() =>
                      setCurrentIndex((i) => (i === 0 ? feedbacks.length - 1 : i - 1))
                    }
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100"
                    aria-label="Previous feedback"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setCurrentIndex((i) => (i === feedbacks.length - 1 ? 0 : i + 1))
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100"
                    aria-label="Next feedback"
                  >
                    ›
                  </button>

                  {/* small indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {feedbacks.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-500"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </main>

         <footer className="mt-10 pt-4 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
  <p className="font-medium">
    Made by <span className="font-semibold text-gray-800 dark:text-gray-200">Harmanpreet Singh</span>
  </p>
  <p className="text-xs mt-1">Final Year — B.E. CSE Student</p>
</footer>
</div>
      </div>

      {/* DELETE STEP 1 — Confirmation */}
      {deleteStep === 1 && (
        <ModalComponent
          title="Confirm deletion"
          onClose={() => {
            setDeleteStep(0);
            setDeleteTarget(null);
            setConfirmText("");
          }}
        >
          <p className="mb-4">Are you sure you want to delete this feedback?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setDeleteStep(0);
                setDeleteTarget(null);
                setConfirmText("");
              }}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => setDeleteStep(2)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Yes, Delete
            </button>
          </div>
        </ModalComponent>
      )}

      {/* DELETE STEP 2 — Type DELETE to confirm */}
      {deleteStep === 2 && (
        <ModalComponent
          title="Type DELETE to Confirm"
          onClose={() => {
            setDeleteStep(0);
            setDeleteTarget(null);
            setConfirmText("");
          }}
        >
          <p className="mb-3">Please type <strong>DELETE</strong> to permanently delete this feedback.</p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full px-3 py-2 border rounded mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setDeleteStep(0);
                setDeleteTarget(null);
                setConfirmText("");
              }}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded"
            >
              Cancel
            </button>

            <button
  onClick={() => {
    if (confirmText === "DELETE") {
      performDelete();
      alert("Deleted Sucessfully :)");
      // close modal
      setDeleteStep(0);
      setDeleteTarget(null);
      setConfirmText("");
    } else {
      alert("Not deleted. Try Again! read instructions carefully!");
      // close modal on wrong text
      setDeleteStep(0);
      setDeleteTarget(null);
      setConfirmText("");
    }
  }}
  className="px-3 py-1 bg-red-600 text-white rounded"
>
  Delete
</button>
         </div>
        </ModalComponent>
      )}
    </div>
  );
}
