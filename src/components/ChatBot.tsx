/**
 * ChatBot Component
 * Modern AI-powered recommendation chatbot
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { recommendationApiService } from '@/services/api/recommendationApi';
import { ChatMessage, RecommendationProduct } from '@/types/recommendation.types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useState('Da Nang, VN');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hi! 👋 I'm your personal fashion assistant. I can help you find the perfect outfit! What are you looking for today?",
        timestamp: new Date(),
        suggestedQuestions: [
          "What should I wear today?",
          "Show me casual outfits",
          "I need formal wear",
          "Looking for summer clothes"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call recommendation API
      const response = await recommendationApiService.getNaturalLanguageRecommendations({
        userId: user?.id?.toString() || '25',
        message: textToSend,
        location: location,
        limit: 10,
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        recommendations: response.recommendations.slice(0, 2), // Show top 2 recommendations
        suggestedQuestions: response.suggestedQuestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: RecommendationProduct) => {
    router.push(`/products/${product.detailId}`);
    setIsOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group"
        aria-label="Open chat"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base">Fashion Assistant</h3>
                <p className="text-[10px] text-white/80">Online • AI-powered</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  // User message
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl rounded-tr-none px-3 py-2 max-w-[80%] shadow-md">
                      <p className="text-xs">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  // Assistant message
                  <div className="flex justify-start">
                    <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 max-w-[85%] shadow-md border border-gray-100">
                      <p className="text-xs text-gray-800 mb-2">{message.content}</p>
                      
                      {/* Product Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.recommendations.map((product) => (
                            <div
                              key={product.detailId}
                              onClick={() => handleProductClick(product)}
                              className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-all border border-gray-200 hover:border-purple-300 hover:shadow-md"
                            >
                              <div className="flex gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={product.imageUrls[0]}
                                  alt={product.productTitle}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-[11px] text-gray-900 line-clamp-2 mb-0.5">
                                    {product.productTitle}
                                  </h4>
                                  <p className="text-[10px] text-gray-500 mb-0.5">
                                    Color: {product.colorName}
                                  </p>
                                  <p className="text-xs font-bold text-purple-600">
                                    {formatPrice(product.price)}
                                  </p>
                                  {product.matchScore > 0 && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-[10px] text-green-600 font-medium">
                                        {product.matchScore}% match
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Questions */}
                      {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          <p className="text-[10px] font-medium text-gray-600 mb-1">Suggested questions:</p>
                          {message.suggestedQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleSendMessage(question)}
                              className="block w-full text-left text-[10px] bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 rounded-md px-2 py-1.5 transition-all border border-purple-200 hover:border-purple-300"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-md border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white text-pink-400">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-1.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
