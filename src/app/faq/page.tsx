'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  items: FAQItem[];
}

function FAQContent() {
  const searchParams = useSearchParams();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState('account');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['account', 'order', 'payment', 'shipping', 'return', 'size'].includes(tab)) {
      setActiveCategory(tab);
    }
  }, [searchParams]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const faqCategories: FAQCategory[] = [
    {
      id: 'account',
      name: 'Tài Khoản',
      items: [
        { question: 'Làm thế nào để tạo tài khoản mới?', answer: 'Bạn có thể tạo tài khoản bằng cách nhấn vào nút "Đăng ký" ở góc trên bên phải trang web. Nhập email, mật khẩu và thông tin cá nhân. Bạn cũng có thể đăng ký nhanh bằng tài khoản Google.' },
        { question: 'Tôi quên mật khẩu, phải làm sao?', answer: 'Nhấn vào "Quên mật khẩu" tại trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn trong vài phút.' },
        { question: 'Làm sao để thay đổi thông tin cá nhân?', answer: 'Đăng nhập vào tài khoản, vào mục "Tài khoản của tôi" > "Thông tin cá nhân". Tại đây bạn có thể cập nhật họ tên, số điện thoại, ngày sinh và ảnh đại diện.' },
        { question: 'Tài khoản của tôi có an toàn không?', answer: 'Chúng tôi sử dụng mã hóa SSL và xác thực Firebase để bảo vệ tài khoản của bạn. Khuyến khích bạn sử dụng mật khẩu mạnh.' }
      ]
    },
    {
      id: 'order',
      name: 'Đơn Hàng',
      items: [
        { question: 'Làm thế nào để đặt hàng?', answer: 'Chọn sản phẩm yêu thích, chọn size và màu sắc, thêm vào giỏ hàng. Sau đó vào giỏ hàng, kiểm tra và nhấn "Thanh toán". Điền địa chỉ giao hàng và chọn phương thức thanh toán.' },
        { question: 'Tôi có thể theo dõi đơn hàng ở đâu?', answer: 'Đăng nhập vào tài khoản, vào "Đơn hàng của tôi" để xem tất cả đơn hàng và trạng thái.' },
        { question: 'Tôi có thể hủy đơn hàng không?', answer: 'Bạn có thể hủy đơn hàng khi đơn chưa được giao cho đơn vị vận chuyển. Vào chi tiết đơn hàng và nhấn "Hủy đơn". Nếu đã thanh toán, tiền sẽ được hoàn trong 3-5 ngày.' }
      ]
    },
    {
      id: 'payment',
      name: 'Thanh Toán',
      items: [
        { question: 'FIT chấp nhận những phương thức thanh toán nào?', answer: 'Chúng tôi chấp nhận: COD, Thẻ tín dụng/ghi nợ Visa/Mastercard.' },
        { question: 'Thanh toán online có an toàn không?', answer: 'Hoàn toàn an toàn. Chúng tôi sử dụng cổng thanh toán Stripe với mã hóa SSL 256-bit.' }
      ]
    },
    {
      id: 'shipping',
      name: 'Vận Chuyển',
      items: [
        { question: 'FIT giao hàng đến những khu vực nào?', answer: 'Chúng tôi giao hàng toàn quốc 63 tỉnh thành Việt Nam thông qua đối tác GHN.' }
      ]
    },
    {
      id: 'return',
      name: 'Đổi Trả',
      items: [
        { question: 'Làm thế nào để yêu cầu đổi/trả hàng?', answer: 'Đăng nhập tài khoản, vào "Đơn hàng của tôi", chọn đơn hàng cần đổi trả, nhấn "Yêu cầu hoàn trả".' },
        { question: 'Thời gian hoàn tiền là bao lâu?', answer: 'Sau khi nhận và kiểm tra hàng trả, chúng tôi hoàn tiền trong 3-5 ngày làm việc.' }
      ]
    },
    {
      id: 'size',
      name: 'Chọn Size',
      items: [
        { question: 'Làm sao để chọn đúng size?', answer: 'Sử dụng tính năng "Gợi ý size" của FIT. Nhập số đo cơ thể, hệ thống AI sẽ đề xuất size phù hợp nhất.' },
        { question: 'Tính năng gợi ý size hoạt động như thế nào?', answer: 'Hệ thống AI phân tích số đo của bạn, so sánh với dữ liệu từ các khách hàng có vóc dáng tương tự.' }
      ]
    }
  ];

  const currentCategory = faqCategories.find(cat => cat.id === activeCategory) || faqCategories[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3a3839] to-[#5a5859] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến về mua sắm tại FIT
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">Danh Mục</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-[#3a3839] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentCategory.name}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {currentCategory.items.map((item, index) => {
                    const itemId = `${activeCategory}-${index}`;
                    const isOpen = openItems[itemId];
                    return (
                      <div key={itemId}>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy câu trả lời?</h2>
          <p className="text-gray-600 mb-6">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
          <a href="/support" className="inline-flex items-center px-6 py-3 bg-[#3a3839] text-white rounded-lg hover:bg-[#4a4849] transition-colors">
            Liên hệ hỗ trợ
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}>
      <FAQContent />
    </Suspense>
  );
}
