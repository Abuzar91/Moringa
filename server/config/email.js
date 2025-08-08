import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { customerInfo, items, totalAmount, orderNumber, paymentMethod } =
      orderData;

    // Debug logging
    console.log(
      "Email Debug - Full orderData:",
      JSON.stringify(orderData, null, 2)
    );
    console.log(
      "Email Debug - Items structure:",
      items.map((item) => ({
        productSnapshot: item.productSnapshot,
        hasName: !!item.productSnapshot?.name,
        name: item.productSnapshot?.name,
      }))
    );

    const itemsHtml = items
      .map((item, index) => {
        // Get product name with multiple fallbacks
        const productName =
          item.productSnapshot?.name ||
          item.name ||
          item.product?.name ||
          `Product ${index + 1}`;

        const productImage =
          item.productSnapshot?.image ||
          item.image ||
          item.product?.image ||
          "";

        console.log(`Email Debug - Item ${index}:`, {
          productName,
          productImage,
          quantity: item.quantity,
          price: item.price,
        });

        return `
     <tr>
  <td style="padding: 20px 15px; border-bottom: 1px solid #f0f0f0;">
    <div style="display: flex; align-items: center; gap: 20px;">
      <!-- Product Image -->
      <div style="flex-shrink: 0;">
        <img src="${productImage}" 
             alt="${productName}" 
             style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e5e5;">
      </div>
      
      <!-- Product Details -->
      <div style="flex: 1; min-width: 0; margin-right: 20px;">
        <h4 style="margin: 0 0 6px 0; color: #333; font-size: 16px; font-weight: 600; line-height: 1.3;">
          ${productName}
        </h4>
        <p style="margin: 0; color: #888; font-size: 14px;">
          Quantity: ${item.quantity}
        </p>
      </div>
      
      <!-- Price -->
      <div style="flex-shrink: 0; text-align: right; min-width: 120px;">
        <div style="color: #16a34a; font-weight: 700; font-size: 16px;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </div>
      </div>
    </div>
  </td>
</tr>
      `;
      })
      .join("");

    const paymentInstructions =
      paymentMethod === "cod"
        ? "Pay when you receive your order"
        : "Send payment screenshot to WhatsApp: +92-3249090438";

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - AM Botonics</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        
        <div style="max-width: 500px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; text-align: center; padding: 30px 20px;">
            <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">Eleve</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Order Confirmed!</p>
          </div>

          <!-- Content -->
          <div style="padding: 25px;">
            
            <!-- Greeting -->
            <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">Hi ${
              customerInfo.fullName
            },</p>
            <p style="margin: 0 0 25px 0; color: #666; font-size: 14px; line-height: 1.5;">Thank you for your order! Here are the details:</p>

            <!-- Order Info -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666; font-size: 13px;">Order #</span>
                <span style="color: #16a34a; font-weight: 600; font-size: 14px;">${orderNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666; font-size: 13px;">Date</span>
                <span style="color: #333; font-size: 13px;">${new Date().toLocaleDateString(
                  "en-PK"
                )}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666; font-size: 13px;">Payment</span>
                <span style="color: #333; font-size: 13px; text-transform: uppercase;">${paymentMethod}</span>
              </div>
            </div>

            <!-- Items -->
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">Items Ordered</h3>
              <table width="100%" style="border-collapse: collapse;">
                ${itemsHtml}
              </table>
              
              <!-- Total -->
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #16a34a; text-align: right;">
                <span style="color: #333; font-size: 16px; font-weight: 600;">Total: </span>
                <span style="color: #16a34a; font-size: 18px; font-weight: 700;">Rs. ${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <!-- Payment & Shipping -->
            <div style="background: #f0fdf4; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 14px; font-weight: 600;">Payment Instructions</h4>
              <p style="margin: 0 0 12px 0; color: #333; font-size: 13px;">${paymentInstructions}</p>
              
              <h4 style="margin: 0 0 8px 0; color: #16a34a; font-size: 14px; font-weight: 600;">Shipping To</h4>
              <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.4;">
                ${customerInfo.fullName}<br>
                ${customerInfo.address.street}<br>
                ${customerInfo.address.city} ${
      customerInfo.address.zipCode || ""
    }<br>
                ${customerInfo.phone}
              </p>
            </div>

            <!-- Support -->
            <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">Need help?</p>
              <a href="https://wa.me/923249090438"
                 style="display: inline-block; background: #25d366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 13px;">
                WhatsApp Support
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #111827; color: white; text-align: center; padding: 20px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Eleve - World's Finest Moringa & Tea Tree Oil Soaps</p>
          </div>

        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Eleve" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Order Confirmation #${orderNumber} - Eleve`,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default transporter;
