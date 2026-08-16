import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.report import Report, AuditLog, Feedback, AIAnalysisLog, EmailVerification

def clear_db():
    db = SessionLocal()
    try:
        print("Clearing tables...")
        db.query(AuditLog).delete()
        db.query(Feedback).delete()
        db.query(AIAnalysisLog).delete()
        db.query(EmailVerification).delete()
        db.query(Report).delete()
        db.commit()
        print("Database cleared successfully (seed users preserved).")
    except Exception as e:
        db.rollback()
        print(f"Error clearing db: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_db()
