'use client';

import React from 'react';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Điều Khoản Chung',
      content: [
        'Khi truy cập và sử dụng website FIT, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.',
        'FIT có quyền thay đổi, chỉnh sửa hoặc cập nhật các điều khoản này bất cứ lúc nào mà không cần thông báo trước.',
        'Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.'
      ]
    },
    {
      title: '2. Tài Khoản Người Dùng',
      content: [
        'Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản.',
        'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của mình.',
        'FIT có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện vi phạm điều khoản sử dụng.'
      ]
    },
    {
      title: '3. Đặt Hàng và Thanh Toán',
      content: [
        'Giá sản phẩm được hiển thị trên website đã bao gồm thuế VAT.',
        'Đơn hàng chỉ được xác nhận sau khi FIT gửi email xác nhận đơn hàng.',
        'FIT có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm hết hàng hoặc có sai sót về giá.',
        'Các phương thức thanh toán được chấp nhận: COD, Thẻ tín dụng/ghi nợ Visa/Mastercard.'
      ]
    },
    {
      title: '4. Giao Hàng',
      content: [
        'Thời gian giao hàng phụ thuộc vào địa chỉ nhận hàng và được thông báo khi đặt hàng.',
        'FIT không chịu trách nhiệm về việc giao hàng chậm trễ do các yếu tố khách quan như thiên tai, dịch bệnh.',
        'Khách hàng cần kiểm tra sản phẩm ngay khi nhận hàng và thông báo nếu có vấn đề.'
      ]
    },
    {
      title: '5. Đổi Trả và Hoàn Tiền',
      content: [
        'Sản phẩm đổi trả phải còn nguyên tem mác, chưa qua sử dụng hoặc giặt.',
        'Hoàn tiền được thực hiện trong 3-5 ngày làm việc sau khi FIT nhận và kiểm tra sản phẩm trả.'
      ]
    },
    {
      title: '6. Quyền Sở Hữu Trí Tuệ',
      content: [
        'Tất cả nội dung trên website bao gồm hình ảnh, logo, văn bản đều thuộc quyền sở hữu của FIT.',
        'Nghiêm cấm sao chép, phân phối hoặc sử dụng nội dung mà không có sự đồng ý bằng văn bản của FIT.'
      ]
    },
    {
      title: '7. Bảo Mật Thông Tin',
      content: [
        'FIT cam kết bảo mật thông tin cá nhân của khách hàng theo chính sách bảo mật.',
        'Thông tin khách hàng chỉ được sử dụng cho mục đích xử lý đơn hàng và cải thiện dịch vụ.',
        'FIT không chia sẻ thông tin cá nhân cho bên thứ ba mà không có sự đồng ý của khách hàng.'
      ]
    },
    {
      title: '8. Giới Hạn Trách Nhiệm',
      content: [
        'FIT không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ.',
        'Trách nhiệm của FIT được giới hạn ở giá trị đơn hàng đã thanh toán.'
      ]
    },
    {
      title: '9. Liên Hệ',
      content: [
        'Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:',
        'Email: support@fit.com',
        'Hotline: 1900 xxxx'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3a3839] to-[#5a5859] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Điều Khoản Sử Dụng</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ của FIT
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 leading-relaxed flex">
                        <span className="text-[#3a3839] mr-3">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
