import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-t border-gray-200 mt-16">
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      <hr className="w-full border-gray-300 mb-4" />
      <span className="text-gray-600 text-sm flex items-center gap-2">
        <span className="text-lg">©</span> {new Date().getFullYear()} &nbsp;|&nbsp; Built by
        <a
          href="https://jiwans-oza.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 font-semibold hover:underline hover:text-indigo-700 transition-colors"
        >
          Jiwans Oza
        </a>
      </span>
    </div>
  </footer>
);

export default Footer; 