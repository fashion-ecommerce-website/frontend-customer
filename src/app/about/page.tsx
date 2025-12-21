'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3a3839] to-[#5a5859] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Về Chúng Tôi</h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            FIT - Nền tảng thời trang trực tuyến hàng đầu với công nghệ AI tiên tiến, 
            mang đến trải nghiệm mua sắm cá nhân hóa cho mọi khách hàng.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tại FIT, chúng tôi tin rằng mỗi người đều xứng đáng có được trang phục phù hợp nhất với phong cách và vóc dáng của mình. 
                Sứ mệnh của chúng tôi là kết hợp công nghệ AI tiên tiến với thời trang để mang đến trải nghiệm mua sắm hoàn hảo.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Với chatbot AI thông minh và công nghệ thử đồ ảo, chúng tôi giúp bạn tìm được sản phẩm ưng ý 
                và giải đáp mọi thắc mắc một cách nhanh chóng.
              </p>
            </div>
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="FIT Store"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tính Năng Nổi Bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#3a3839] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chatbot AI Thông Minh</h3>
              <p className="text-gray-600">
                Trợ lý ảo AI sẵn sàng hỗ trợ bạn 24/7, giải đáp thắc mắc và tư vấn sản phẩm phù hợp.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#3a3839] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Thử Đồ Ảo</h3>
              <p className="text-gray-600">
                Xem trước sản phẩm trên hình ảnh của bạn với công nghệ AI tiên tiến trước khi quyết định mua.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#3a3839] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gợi Ý Cá Nhân Hóa</h3>
              <p className="text-gray-600">
                Nhận đề xuất sản phẩm dựa trên sở thích và phong cách riêng của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc góp ý? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@fit.com" className="inline-flex items-center justify-center px-6 py-3 bg-[#3a3839] text-white rounded-lg hover:bg-[#4a4849] transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@fit.com
            </a>
            <a href="tel:1900xxxx" className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#3a3839] text-[#3a3839] rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              1900 xxxx
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
