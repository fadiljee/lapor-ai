class PromptInjectionGuard:
    MAX_CHAR_LIMIT = 2000

    def sanitize_and_wrap(self, user_text: str) -> str:
        if not user_text:
            return "<user_report></user_report>"
            
        # Truncate if exceeds limit
        clean_text = user_text.strip()
        if len(clean_text) > self.MAX_CHAR_LIMIT:
            clean_text = clean_text[:self.MAX_CHAR_LIMIT]
            
        # Replace dangerous prompt manipulation escape tags if any
        clean_text = clean_text.replace("</user_report>", "[REDACTED_TAG]")
        clean_text = clean_text.replace("<user_report>", "[REDACTED_TAG]")
        
        return f"<user_report>\n{clean_text}\n</user_report>"

prompt_injection_guard = PromptInjectionGuard()
