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

email_service = ResendEmailService()
