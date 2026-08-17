import json
import logging
import urllib.request
import urllib.error
from app.core.config import settings

logger = logging.getLogger("lapor-ai-email")

class ResendEmailService:
    def __init__(self):
        self.api_key = settings.RESEND_API_KEY
        self.from_email = settings.RESEND_FROM_EMAIL

    def send_otp_email(self, to_email: str, otp_code: str, ticket_id: str = None) -> bool:
        if not self.api_key:
            logger.warning("RESEND_API_KEY is missing. Skipping email send.")
            print(f"📧 [MOCK EMAIL] OTP {otp_code} for {to_email}")
            return False

        subject = f"[{otp_code}] Kode Verifikasi Laporan Pengaduan - LAPOR-AI"
        
        ticket_info_html = ""
        if ticket_id:
            ticket_info_html = f"""
            <div style="background-color: #F1EFE7; border-left: 4px solid #1E3D36; padding: 12px; margin-bottom: 20px; font-size: 12px;">
              <strong>Nomor Tiket Pengaduan:</strong> <span style="font-family: monospace; font-weight: bold; color: #1E3D36;">{ticket_id}</span>
            </div>
            """

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Public Sans', Arial, sans-serif; background-color: #F1EFE7; color: #1B1B18; margin: 0; padding: 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E0DED4; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; }}
            .header {{ background-color: #1E3D36; color: #ffffff; padding: 24px; text-align: left; }}
            .header h2 {{ margin: 0; font-size: 20px; letter-spacing: 1px; color: #ffffff; }}
            .content {{ padding: 28px 24px; text-align: left; }}
            .otp-box {{ background-color: #F1EFE7; border: 1px border #1E3D36; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E3D36; }}
            .footer {{ background-color: #12211D; color: #6B6F63; padding: 16px 24px; text-align: center; font-size: 11px; border-top: 1px solid #1E3D36; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>LAPOR-AI · Verifikasi Pengaduan</h2>
            </div>
            <div class="content">
              <p style="font-size: 14px; margin-top: 0; color: #1B1B18;">Halo Warga Pelapor,</p>
              <p style="font-size: 13px; color: #6B6F63; line-height: 1.6;">
                Terima kasih telah mengajukan laporan pengaduan melalui sistem LAPOR-AI. Gunakan kode verifikasi OTP di bawah ini untuk mengonfirmasi email Anda:
              </p>
              
              {ticket_info_html}

              <div class="otp-box">{otp_code}</div>
              
              <p style="font-size: 12px; color: #6B6F63; line-height: 1.5;">
                Kode ini berlaku selama <strong>15 menit</strong>. Jika Anda tidak merasa mengajukan laporan, silakan abaikan email ini.
              </p>
            </div>
            <div class="footer">
              LAPOR-AI · Sistem Pengaduan Warga Berbasis AI Human-in-the-Loop<br>
              © 2026 Republik Indonesia · lapor-ai.web.id
            </div>
          </div>
        </body>
        </html>
        """

        payload = {
            "from": self.from_email,
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }

        try:
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "Resend-Python/1.0"
                },
                method="POST"
            )
            with urllib.request.urlopen(req) as resp:
                res_body = json.loads(resp.read().decode("utf-8"))
                logger.info(f"✅ Email OTP sent successfully to {to_email}: {res_body}")
                print(f"✅ [RESEND] Email OTP sent to {to_email} with id: {res_body.get('id')}")
                return True
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            logger.error(f"❌ Resend API Error: {e.code} - {err_body}")
            print(f"❌ [RESEND ERROR] Status {e.code}: {err_body}")
            return False
        except Exception as ex:
            logger.error(f"❌ Failed to send email via Resend: {str(ex)}")
            print(f"❌ [RESEND EXCEPTION] {str(ex)}")
            return False

    def send_support_email(self, nama: str, sender_email: str, pesan: str) -> bool:
        """
        FR-EM.1 & FR-EM.3: Kirim email otomatis dari bantuan@lapor-ai.web.id saat warga mengisi form Hubungi Kami.
        Mengirimkan email konfirmasi penerimaan ke warga dan notifikasi ke inbox tim support.
        """
        if not self.api_key:
            logger.warning("RESEND_API_KEY is missing. Mocking support email sending.")
            print(f"📧 [MOCK EMAIL SUPPORT] From {nama} ({sender_email}): {pesan[:50]}...")
            return True

        # 1. Email Konfirmasi Otomatis ke Warga (Auto-Reply)
        subject_user = "Kami Telah Menerima Pesan Anda - LAPOR-AI Support"
        html_user = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: Arial, sans-serif; background-color: #F1EFE7; color: #1B1B18; margin: 0; padding: 20px; }}
            .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E0DED4; border-radius: 8px; overflow: hidden; }}
            .header {{ background-color: #1E3D36; color: #ffffff; padding: 24px; text-align: left; }}
            .header h2 {{ margin: 0; font-size: 18px; color: #ffffff; }}
            .content {{ padding: 24px; text-align: left; font-size: 13px; line-height: 1.6; }}
            .message-box {{ background-color: #F1EFE7; border-left: 4px solid #1E3D36; padding: 12px 16px; margin: 16px 0; font-style: italic; color: #333; }}
            .footer {{ background-color: #12211D; color: #8A8E82; padding: 16px 24px; text-align: center; font-size: 11px; border-top: 1px solid #1E3D36; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>LAPOR-AI · Support & Bantuan Warga</h2>
            </div>
            <div class="content">
              <p>Halo <strong>{nama}</strong>,</p>
              <p>
                Terima kasih telah menghubungi Tim Dukungan LAPOR-AI. Pesan dan pertanyaan Anda telah berhasil kami terima dan saat ini sedang ditinjau oleh tim kami.
              </p>
              
              <div class="message-box">
                "{pesan}"
              </div>

              <p>
                Tim kami akan membalas pesan ini langsung ke alamat email Anda (<strong>{sender_email}</strong>) dalam waktu 1x24 jam kerja.
              </p>
              <p>Salam hangat,<br><strong>Tim Dukungan LAPOR-AI</strong></p>
            </div>
            <div class="footer">
              LAPOR-AI · bantuan@lapor-ai.web.id<br>
              © 2026 Republik Indonesia
            </div>
          </div>
        </body>
        </html>
        """

        # 2. Email Notifikasi ke Inbox Bantuan/Tim Developer
        subject_admin = f"[BANTUAN WARGA] Pesan baru dari {nama} ({sender_email})"
        html_admin = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; color: #111; padding: 20px; }}
            .card {{ max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ccc; padding: 20px; border-radius: 6px; }}
            .field {{ margin-bottom: 12px; font-size: 14px; }}
            .label {{ font-weight: bold; color: #1E3D36; }}
            .box {{ background: #f9f9f9; padding: 12px; border: 1px solid #eee; margin-top: 8px; font-size: 13px; white-space: pre-wrap; }}
          </style>
        </head>
        <body>
          <div class="card">
            <h3 style="color: #1E3D36; margin-top:0;">📥 Pesan Masuk Form Hubungi Kami</h3>
            <div class="field"><span class="label">Nama Pelapor:</span> {nama}</div>
            <div class="field"><span class="label">Email Pelapor:</span> {sender_email}</div>
            <div class="field"><span class="label">Isi Pesan / Kendala:</span></div>
            <div class="box">{pesan}</div>
          </div>
        </body>
        </html>
        """

        success = True
        for recipient, subj, html_body, reply_address in [
            (sender_email, subject_user, html_user, settings.SUPPORT_TARGET_EMAIL),
            (settings.SUPPORT_TARGET_EMAIL, subject_admin, html_admin, sender_email)
        ]:
            payload = {
                "from": self.from_email,
                "to": [recipient],
                "reply_to": reply_address,
                "subject": subj,
                "html": html_body
            }

            try:
                req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                        "User-Agent": "Resend-Python/1.0"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req) as resp:
                    res_body = json.loads(resp.read().decode("utf-8"))
                    logger.info(f"✅ Email Support sent to {recipient}: {res_body}")
                    print(f"✅ [RESEND SUPPORT] Email sent to {recipient} with id: {res_body.get('id')}")
            except Exception as ex:
                logger.error(f"❌ Failed to send support email to {recipient}: {str(ex)}")
                print(f"❌ [RESEND SUPPORT EXCEPTION] {str(ex)}")
                success = False

        return success

email_service = ResendEmailService()

