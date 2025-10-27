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
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-14 bg-neutral-100 inline-flex flex-col justify-start items-start">
      <div className="self-stretch flex flex-col justify-start items-center gap-1">
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="self-stretch text-center justify-center text-black text-xl sm:text-2xl lg:text-3xl font-bold font-['SVN-Product_Sans'] uppercase leading-7 sm:leading-8 lg:leading-10 px-2">SIGN UP FOR OUR NEWSLETTER</div>
        </div>
        <div className="w-full sm:w-[600px] lg:w-[850px] max-w-[850px] flex flex-col justify-start items-center px-4 sm:px-0">
          <div className="text-center justify-center text-slate-800 text-sm sm:text-base font-normal font-['SVN-Product_Sans'] leading-tight">
            Stay up to date with fashion news about products, upcoming collections, and special promotions and our latest weekly
            <span className="hidden sm:inline"><br/></span>
            <span className="sm:hidden"> </span>
            fashion trends.
          </div>
        </div>
        <div className="w-full sm:w-[400px] lg:w-[500px] pt-4 sm:pt-6 relative flex flex-col justify-start items-start px-2 sm:px-0">
          <div className="self-stretch h-10 sm:h-10 px-3 sm:px-4 py-2.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-black inline-flex items-center overflow-hidden relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to subscribe to news"
              className="w-full h-full outline-none text-neutral-700 placeholder:text-neutral-500 text-sm sm:text-base pr-20 sm:pr-28"
              aria-label="Email"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 px-3 sm:px-3.5 pt-2.5 pb-3 right-2 sm:right-0 top-4 sm:top-6 absolute bg-black rounded-tr rounded-br flex flex-col justify-center items-center cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <div className="text-center justify-center text-white text-xs sm:text-sm font-bold font-['SVN-Product_Sans'] leading-tight">SIGN UP</div>
          </button>
        </div>
      </div>
    </div>
  );
};


