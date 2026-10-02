import nodemailer from "nodemailer";

class EmailService {
  static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // 🔥 Main method — ticket PDF ke saath email bhejo
  static async sendTicket({ to, name, booking, pdfUrl, pdfBuffer }) {
    try {
      const attachments = [];

      // Priority 1: direct buffer (best — koi external download nahi)
      if (pdfBuffer) {
        attachments.push({
          filename: `ticket-${booking.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        });
      }
      // Priority 2: remote URL se fetch karke attach karo
      else if (pdfUrl) {
        attachments.push({
          filename: `ticket-${booking.id}.pdf`,
          path: pdfUrl,
          contentType: "application/pdf",
        });
      }

      const info = await this.transporter.sendMail({
        from: `"Heritage Booking" <${process.env.MAIL_USER}>`,
        to,
        subject: `Your Booking Confirmed — ${booking.place?.name || "Heritage Ticket"}`,
        html: this._buildTemplate({ name, booking, to }),
        attachments,
      });

      console.log("Email Success:", info.messageId);
      return info;
    } catch (error) {
      console.log("Email Error:", error.message);
      return null;
    }
  }

  // 🔥 Optional — sirf plain email bhejna ho (bina PDF)
  static async sendMail({ to, subject, html, attachments = [] }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Heritage Booking" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
      });

      console.log("Email Success:", info.messageId);
      return info;
    } catch (error) {
      console.log("Email Error:", error.message);
      return null;
    }
  }

  // 🔥 HTML Template (private)
  static _buildTemplate({ name, booking, to }) {
    const slot = booking.slotDateTime
      ? new Date(booking.slotDateTime)
      : null;

    const formattedDate = slot
      ? slot.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

    const formattedTime = slot
      ? slot.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "-";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Booking Confirmation</title>
      </head>

      <body style="margin:0;padding:0;background:#f5f1e8;font-family:Arial,sans-serif;">
        <div style="
          max-width:600px;
          margin:40px auto;
          background:#ffffff;
          border-radius:12px;
          overflow:hidden;
          border:1px solid #e5d5a5;
        ">

          <div style="
            background:#0b2149;
            padding:30px;
            text-align:center;
            color:#ffffff;
          ">
            <h1 style="
              margin:0;
              color:#d9a441;
              font-family:Georgia,serif;
            ">
              ${booking.place?.name || "Heritage Monument"}
            </h1>
            <p style="margin-top:8px;">Booking Confirmation</p>
          </div>

          <div style="padding:30px;">
            <h2 style="color:#0b2149;">Hello ${name},</h2>

            <p style="color:#555;">
              Your booking has been successfully confirmed.
              Please find your e-ticket attached with this email.
            </p>

            <div style="
              margin-top:25px;
              padding:20px;
              background:#f8f4ea;
              border-radius:10px;
            ">
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Phone:</strong> ${booking.phone || "-"}</p>
              <p><strong>Place:</strong> ${booking.place?.name || "-"}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Total Amount:</strong> Rs ${booking.totalAmount || "-"}</p>
              <p><strong>Status:</strong> ${booking.status || "PAID"}</p>
            </div>

            <p style="margin-top:25px;color:#555;">
              Thank you for booking with us. Please carry a valid ID proof at the entry gate.
            </p>
          </div>

          <div style="
            background:#0b2149;
            padding:15px;
            text-align:center;
            color:#ffffff;
            font-size:12px;
          ">
            Official Booking Counter
          </div>

        </div>
      </body>
      </html>
    `;
  }
}

export default EmailService;