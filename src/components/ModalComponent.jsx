import React from 'react';

/**
 * ModalComponent
 * -----------------------
 * A simple reusable modal dialog wrapper.
 *  Darkens the background using a semi-transparent overlay
 * Centers modal content on the screen
 * Displays a title and a close button
 *   Renders dynamic children inside the modal body
 *
 * @param {{ children: any, title: string, onClose: Function }} props
 */
export default function ModalComponent({ children, title, onClose }) {
  return (
    // Background overlay to block interaction with page content
    <div
      className="fixed inset-0 
                 bg-black/50 dark:bg-black/60 
                 flex items-center justify-center 
                 z-40"
    >
      {/* Modal container */}
      <div
        className="relative 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   rounded-lg max-w-md w-full 
                   p-5 shadow-xl"
      >
        {/* HEADER: Title + Close Button */}
        <header className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{title}</h3>

          {/* Close icon button */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 
                       hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* MAIN CONTENt */}
        <div>{children}</div>
      </div>
    </div>
  );
}
