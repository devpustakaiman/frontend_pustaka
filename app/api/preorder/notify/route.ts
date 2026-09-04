import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      book_title,
      quantity,
      transfer_receipt,
      receiptUrl,
    } = body;

    const receipt = transfer_receipt || receiptUrl || "-";
    const cleanPhone = (customer_phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

    // 1. Query site_settings where id = 'default' to retrieve preorder_notification_email
    const { data: setting } = await supabase
      .from("site_settings")
      .select("preorder_notification_email")
      .eq("id", "default")
      .maybeSingle();

    const recipient = setting?.preorder_notification_email || "Pt_iiman@yahoo.com";
    const subject = `[Pre-Order Baru] - ${book_title} oleh ${customer_name}`;

    // 2. Email dispatch via Resend API or console notification logger
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Pustaka Iman <preorder@pustakaiiman.com>",
            to: [recipient],
            subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
                <h2 style="color: #E52E2D; margin-top: 0;">Pemberitahuan Pre-Order Baru</h2>
                <p style="color: #374151; font-size: 14px;">Ada pemesanan pre-order buku baru yang telah berhasil masuk:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1f2937;">
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; font-weight: bold; width: 150px;">Nama Pembeli:</td>
                    <td style="padding: 10px 0;">${customer_name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; font-weight: bold;">Alamat Email:</td>
                    <td style="padding: 10px 0;"><a href="mailto:${customer_email}" style="color: #E52E2D;">${customer_email}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; font-weight: bold;">No. WhatsApp:</td>
                    <td style="padding: 10px 0;">
                      ${customer_phone} 
                      ${waLink ? `<a href="${waLink}" target="_blank" style="margin-left: 8px; color: #25D366; font-weight: bold; text-decoration: none;">[ Chat WhatsApp ]</a>` : ""}
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; font-weight: bold;">Judul Buku:</td>
                    <td style="padding: 10px 0;"><strong>${book_title}</strong></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; font-weight: bold;">Kuantiti:</td>
                    <td style="padding: 10px 0;">${quantity} eksemplar</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold;">Bukti Transfer:</td>
                    <td style="padding: 10px 0;">
                      ${receipt !== "-" 
                        ? `<a href="${receipt}" target="_blank" style="color: #E52E2D; font-weight: bold;">Lihat Lampiran Bukti Transfer</a>` 
                        : "<span style='color: #6b7280;'>Belum diunggah</span>"}
                    </td>
                  </tr>
                </table>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Resend email dispatch error:", emailErr);
      }
    } else {
      console.log(
        `[Pre-Order Notification] Subject: "${subject}" to ${recipient}`,
        {
          customer_name,
          customer_email,
          customer_phone,
          book_title,
          quantity,
          receipt,
        }
      );
    }

    return NextResponse.json({
      success: true,
      recipient,
      subject,
      message: "Preorder notification email dispatched successfully",
    });
  } catch (error: any) {
    console.error("Pre-order notification API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
