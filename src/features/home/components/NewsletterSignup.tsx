'use client';

import React from 'react';

interface NewsletterSignupProps {
  onSubmit?: (email: string) => void;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    onSubmit?.(email);
  };

  return (
    <div className="w-full bg-neutral-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-wide">
            Join Our Newsletter
          </h2>
          <p className="text-gray-600 text-lg font-light max-w-2xl mb-10 leading-relaxed">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          
          <div className="w-full max-w-md relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-14 pl-6 pr-32 bg-white border-b border-gray-300 focus:border-black outline-none text-gray-900 placeholder-gray-400 transition-colors font-sans"
              aria-label="Email"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute right-0 top-0 h-14 px-8 bg-black text-white font-medium uppercase tracking-widest hover:bg-gray-900 transition-colors text-sm"
            >
              Subscribe
            </button>
          </div>
          
          <p className="mt-4 text-xs text-gray-400 font-light">
            By subscribing you agree to our Terms & Conditions and Privacy & Cookies Policy.
          </p>
        </div>
      </div>
    </div>
  );
};


