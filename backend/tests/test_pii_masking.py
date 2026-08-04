from app.services.pii_masking_service import pii_masking_service

def test_nik_masking():
    text = "NIK pelapor adalah 1234567890123456 tolong diproses."
    masked = pii_masking_service.mask_text(text)
    assert "[REDACTED_NIK]" in masked
    assert "1234567890123456" not in masked

def test_phone_masking():
    text = "Hubungi 081234567890 jika darurat."
    masked = pii_masking_service.mask_text(text)
    assert "[REDACTED_PHONE]" in masked

def test_email_masking():
    text = "Email saya bpk.budi@domain.com terima kasih."
    masked = pii_masking_service.mask_text(text)
    assert "[REDACTED_EMAIL]" in masked

def test_name_masking():
    text = "Laporan dari Bapak Joko Widodo di lokasi."
    masked = pii_masking_service.mask_text(text)
    assert "[REDACTED_NAME]" in masked

if __name__ == "__main__":
    test_nik_masking()
    test_phone_masking()
    test_email_masking()
    test_name_masking()
    print("All PII masking tests passed!")
