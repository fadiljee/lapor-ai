import hashlib
import re

class DuplicateDetectionService:
    def generate_fingerprint(self, text: str) -> str:
        if not text:
            return ""
        # 1. Lowercase
        normalized = text.lower()
        # 2. Remove punctuation and extra whitespace
        normalized = re.sub(r'[^\w\s]', '', normalized)
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        # 3. Hash MD5/SHA256 fingerprint
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

duplicate_detection_service = DuplicateDetectionService()
