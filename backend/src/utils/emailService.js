const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email utility
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Lisse Beauty" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Chào mừng bạn đến với Lisse Beauty!</h2>
      <p>Xin chào ${user.name},</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại Lisse Beauty. Chúng tôi rất vui được phục vụ bạn.</p>
      <p>Với tài khoản của mình, bạn có thể:</p>
      <ul>
        <li>Đặt lịch hẹn các dịch vụ làm đẹp</li>
        <li>Theo dõi lịch sử dịch vụ</li>
        <li>Nhận thông báo về các ưu đãi đặc biệt</li>
        <li>Đánh giá và chia sẻ trải nghiệm</li>
      </ul>
      <p>Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.</p>
      <p>Trân trọng,<br>Đội ngũ Lisse Beauty</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject: "Chào mừng bạn đến với Lisse Beauty!",
    html,
  });
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Xác nhận đặt lịch hẹn</h2>
      <p>Xin chào ${booking.customerInfo.name},</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. Dưới đây là thông tin chi tiết:</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Mã đặt lịch:</strong> ${booking.bookingId}</p>
        <p><strong>Dịch vụ:</strong> ${booking.serviceId.name}</p>
        <p><strong>Ngày hẹn:</strong> ${new Date(
          booking.appointmentDate
        ).toLocaleDateString("vi-VN")}</p>
        <p><strong>Giờ hẹn:</strong> ${booking.appointmentTime}</p>
        <p><strong>Giá dịch vụ:</strong> ${booking.price.toLocaleString(
          "vi-VN"
        )} VNĐ</p>
        <p><strong>Trạng thái:</strong> Đang chờ xác nhận</p>
      </div>
      
      <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.</p>
      <p>Cảm ơn bạn đã tin tưởng Lisse Beauty!</p>
      
      <p>Trân trọng,<br>Đội ngũ Lisse Beauty</p>
    </div>
  `;

  return await sendEmail({
    email: booking.customerInfo.email,
    subject: `Xác nhận đặt lịch hẹn #${booking.bookingId}`,
    html,
  });
};

// Send booking reminder email
const sendBookingReminderEmail = async (booking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Nhắc nhở lịch hẹn</h2>
      <p>Xin chào ${booking.customerInfo.name},</p>
      <p>Đây là lời nhắc về lịch hẹn của bạn tại Lisse Beauty:</p>
      
      <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
        <p><strong>Mã đặt lịch:</strong> ${booking.bookingId}</p>
        <p><strong>Dịch vụ:</strong> ${booking.serviceId.name}</p>
        <p><strong>Ngày hẹn:</strong> ${new Date(
          booking.appointmentDate
        ).toLocaleDateString("vi-VN")}</p>
        <p><strong>Giờ hẹn:</strong> ${booking.appointmentTime}</p>
      </div>
      
      <p>Vui lòng đến đúng giờ để được phục vụ tốt nhất. Nếu có thay đổi, hãy liên hệ với chúng tôi trước 24 giờ.</p>
      
      <p>Chúng tôi rất mong được gặp bạn!</p>
      <p>Trân trọng,<br>Đội ngũ Lisse Beauty</p>
    </div>
  `;

  return await sendEmail({
    email: booking.customerInfo.email,
    subject: `Nhắc nhở lịch hẹn #${booking.bookingId} - Ngày mai`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingReminderEmail,
};
