import re
from typing import Dict, List

# Regex patterns for PII detection
NIK_PATTERN = re.compile(r'\b\d{16}\b')
PHONE_PATTERN = re.compile(r'\b(?:\+62|08)\d{9,11}\b')
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
NAME_PATTERN = re.compile(r'\b(?:Bapak|Ibu|Sdr\.?|Tn\.?|Ny\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b')

def mask_nik(text: str) -> str:
    return NIK_PATTERN.sub('[REDACTED_NIK]', text)

def mask_phone(text: str) -> str:
    return PHONE_PATTERN.sub('[REDACTED_PHONE]', text)

def mask_email(text: str) -> str:
    return EMAIL_PATTERN.sub('[REDACTED_EMAIL]', text)

def mask_name(text: str) -> str:
    return NAME_PATTERN.sub(lambda m: f'Bapak/Ibu [REDACTED_NAME]', text)

def mask_pii(text: str) -> str:
    """Apply all PII masking layers in sequence."""
    text = mask_email(text)
    text = mask_phone(text)
    text = mask_nik(text)
    text = mask_name(text)
    return text

def generate_fingerprint(text: str) -> str:
    """Generate a normalized fingerprint for duplicate detection."""
    normalized = text.lower().strip()
    normalized = re.sub(r'[^\w\s]', '', normalized)
    normalized = ' '.join(normalized.split())
    import hashlib
    return hashlib.sha256(normalized.encode()).hexdigest()