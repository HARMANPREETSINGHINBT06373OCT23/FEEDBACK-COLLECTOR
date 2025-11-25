Feedback Collector – React + Tailwind CSS

A modren and clean feedback collection application built using React, Tailwind CSS, and localStorage.
Users can submit feedback, filter it, search it, and delete entries using a secure two-step delete flow.

This project was created as part of an interview assignment.

Features
Submit Feedback

Collects name, email, and message

Validation for required fields

Basic email format validation

Inline asterisk warnings for empty required fields

Search & Filters

Search feedback by name, email, or message

Filter by date range (From / To)

Quick search using the search icon

Feedback List

Displays all feedback in reverse chronological order

Shows name, email, message, and timestamp

Built using reusable component structure

Two-Step Delete Confirmation

Step 1 → Confirm delete modal

Step 2 → Type DELETE to permanently remove

Prevents accidental deletions

Auto-Sliding Feedback Carousel

Smooth slideshow of feedback

Auto-play with pause on hover

Manual previous/next buttons

Small slide indicators

Fully responsive

Light / Dark Theme

One-tap theme switch (Sun/Moon icon)

Uses Tailwind’s built-in dark mode

Project Structure
![App Screenshot](./screenshot360.png)



This structure follows the guidelines from the assignment:

Components separated cleanly

Services folder for storage / API-like logic

Utils for helpers

Assets for icons

Tech Used

React 18

Tailwind CSS

Heroicons

localStorage for temporary persistence

Vercel / GitHub Pages for hosting

How to Run Locally
npm install
npm start


The app will run at:

http://localhost:3000

Build for Production
npm run build

Deployment

This project can be deployed easily on:

GitHub 

Vercel live deployed

Author

Harmanpreet Singh
Final Year – B.E. CSE Student
