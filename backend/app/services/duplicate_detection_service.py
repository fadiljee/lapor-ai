import hashlib
import re

class DuplicateDetectionService:
    def generate_fingerprint(self, text: str) -> str:
        if not text:
            return ""
                      
        normalized = text.lower()
                                                    
        normalized = re.sub(r'[^\w\s]', '', normalized)
        normalized = re.sub(r'\s+', ' ', normalized).strip()
                                        
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

duplicate_detection_service = DuplicateDetectionService()
