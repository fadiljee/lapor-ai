import re

class PIIMaskingService:
    def __init__(self):
                                          
        self.nik_pattern = re.compile(r'\b\d{16}\b')
        self.phone_pattern = re.compile(r'(\+?62|0)8[1-9][0-9]{7,10}\b')
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        
                                                                                             
        self.name_prefix_pattern = re.compile(
            r'\b(Bpk|Bapak|Ibu|Bu|Pak|Sdr|Saudara|Saudari)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            re.IGNORECASE
        )

    def mask_text(self, text: str) -> str:
        if not text:
            return ""
            
        masked = text
        
                     
        masked = self.nik_pattern.sub('[REDACTED_NIK]', masked)
        
                       
        masked = self.phone_pattern.sub('[REDACTED_PHONE]', masked)
        
                       
        masked = self.email_pattern.sub('[REDACTED_EMAIL]', masked)
        
                                                   
        def replace_name(match):
            prefix = match.group(1)
            return f"{prefix} [REDACTED_NAME]"
            
        masked = self.name_prefix_pattern.sub(replace_name, masked)
        
        return masked

pii_masking_service = PIIMaskingService()
