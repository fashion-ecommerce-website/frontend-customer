"use client";

import React, { useState, useEffect, useRef } from "react";
import { recommendationApiService } from "@/services/api/recommendationApi";
import {
  ChatMessage,
  ProductRecommendationResponse,
} from "@/types/recommendation.types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "fashion_chat_history";

interface RecommendationCarouselProps {
  products: ProductRecommendationResponse[];
  onProductClick: (product: ProductRecommendationResponse) => void;
  formatPrice: (price: number) => string;
}

const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  products,
  onProductClick,
  formatPrice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="mt-3 relative group/carousel">
      <div
        className="rounded-xl p-[2px] bg-gradient-animate shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => onProductClick(currentProduct)}
      >
        <div className="group bg-white rounded-[10px] p-3 flex gap-4 relative overflow-hidden h-full">
          {/* Navigation Buttons - Visible on hover */}
          {products.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white text-gray-800"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white text-gray-800"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Product Content */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="relative w-20 h-24 overflow-hidden rounded-md bg-gray-100 shrink-0">
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:underline decoration-1 underline-offset-2">
                {currentProduct.title}
              </h4>
              <p className="text-xs text-gray-500 capitalize">
                {currentProduct.color} • {currentProduct.size}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-bold text-black">
                {formatPrice(currentProduct.price)}
              </p>
              {products.length > 1 && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {currentIndex + 1}/{products.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        const rehydrated = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(rehydrated);
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Hi! 👋 I'm your personal fashion assistant. I can help you find the perfect outfit! What are you looking for today?",
        timestamp: new Date(),
        suggestedQuestions: [
          "What should I wear today?",
          "Show me casual outfits",
          "I need formal wear",
          "Looking for summer clothes",
        ],
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
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call recommendation API
      const response =
        await recommendationApiService.getCombinedMessageRecommendations({
          message: textToSend,
        });

      if (response.success && response.data) {
        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.message || response.message || "Here are some recommendations for you.",
          timestamp: new Date(),
          recommendations: response.data.recommendations,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.message || "Failed to get recommendations");
      }
    } catch {
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    // Re-trigger welcome message logic
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Hi! 👋 I'm your personal fashion assistant. I can help you find the perfect outfit! What are you looking for today?",
        timestamp: new Date(),
        suggestedQuestions: [
          "What should I wear today?",
          "Show me casual outfits",
          "I need formal wear",
          "Looking for summer clothes",
        ],
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  const handleProductClick = (product: ProductRecommendationResponse) => {
    router.push(`/products/${product.objectId}`);
    setIsOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-6 z-40 bg-black text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          className="w-6 h-6"
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
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] sm:w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 duration-300 font-sans">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-gray-900">
                  FASHION ASSISTANT
                </h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Online
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                title="Clear Chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.role === "user" ? (
                  // User message
                  <div className="bg-zinc-900 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] shadow-sm text-sm">
                    <p>{message.content}</p>
                  </div>
                ) : (
                  // Assistant message
                  <div className="max-w-[95%] w-full">
                    <div className="text-sm text-black font-medium mb-2">
                      <p className="leading-relaxed">{message.content}</p>
                    </div>

                    {/* Product Recommendations */}
                    {message.recommendations &&
                      message.recommendations.length > 0 && (
                        <RecommendationCarousel
                          products={message.recommendations}
                          onProductClick={handleProductClick}
                          formatPrice={formatPrice}
                        />
                      )}

                    {/* Suggested Questions */}
                    {message.suggestedQuestions &&
                      message.suggestedQuestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {message.suggestedQuestions.map(
                              (question, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSendMessage(question)}
                                  className="text-left text-xs bg-gray-50 hover:bg-black hover:text-white text-gray-600 rounded-full px-4 py-2 transition-all border border-gray-200"
                                >
                                  {question}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-gray-50 rounded-full px-2 py-2 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for outfit ideas..."
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-900 placeholder-gray-500 px-3"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-black text-white rounded-full p-2.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
