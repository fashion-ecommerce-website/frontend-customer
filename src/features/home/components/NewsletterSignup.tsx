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
    <div className="w-full px-4 sm:px-6 lg:px-12 py-14 bg-neutral-100 inline-flex flex-col justify-start items-start">
      <div className="self-stretch flex flex-col justify-start items-center gap-1">
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="self-stretch text-center justify-center text-black text-3xl font-bold font-['SVN-Product_Sans'] uppercase leading-10">SIGN UP FOR OUR NEWSLETTER</div>
        </div>
        <div className="w-[850px] max-w-[850px] flex flex-col justify-start items-center">
          <div className="text-center justify-center text-slate-800 text-base font-normal font-['SVN-Product_Sans'] leading-tight">Stay up to date with fashion news about products, upcoming collections, and special promotions and our latest weekly<br/>fashion trends.</div>
        </div>
        <div className="w-[500px] pt-6 relative flex flex-col justify-start items-start">
          <div className="self-stretch h-10 px-4 py-2.5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-black inline-flex items-center overflow-hidden relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to subscribe to news"
              className="w-full h-full outline-none text-neutral-700 placeholder:text-neutral-500 text-base pr-28"
              aria-label="Email"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 px-3.5 pt-2.5 pb-3 right-0 top-6 absolute bg-black rounded-tr rounded-br flex flex-col justify-center items-center cursor-pointer"
          >
            <div className="text-center justify-center text-white text-sm font-bold font-['SVN-Product_Sans'] leading-tight">SIGN UP</div>
          </button>
        </div>
      </div>
    </div>
  );
};


