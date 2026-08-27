import os
import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.report import Report, AIAnalysisLog, Feedback, AuditLog
import logging

logger = logging.getLogger(__name__)

RETENTION_DAYS = 1825 

def run_retention_cleanup():
    logger.info("Memulai proses pembersihan retensi data otomatis (UU PDP)...")
    db: Session = SessionLocal()
    try:
        cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=RETENTION_DAYS)
        
        # Ambil id dan path file saja untuk efisiensi (tanpa load seluruh kolom)
        expired_reports = db.query(Report.id, Report.lampiran_path).filter(
            Report.created_at < cutoff_date,
            Report.status == "Closed"
        ).all()
        
        if not expired_reports:
            logger.info("Tidak ada data laporan usang yang perlu dihapus.")
            return

        # 1. Hapus File Fisik
        for report in expired_reports:
            if report.lampiran_path and report.lampiran_path.startswith("/uploads/"):
                filepath = os.path.join(os.getcwd(), report.lampiran_path.lstrip("/"))
                if os.path.exists(filepath):
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        logger.error(f"Gagal menghapus file {filepath}: {e}")
        
        # Ambil daftar ID laporan yang akan dihapus
        report_ids = [r.id for r in expired_reports]

        # 2. Bulk Delete Relasi Database (Mencegah N+1 Queries)
        db.query(AIAnalysisLog).filter(AIAnalysisLog.report_id.in_(report_ids)).delete(synchronize_session=False)
        db.query(Feedback).filter(Feedback.report_id.in_(report_ids)).delete(synchronize_session=False)
        db.query(AuditLog).filter(AuditLog.report_id.in_(report_ids)).delete(synchronize_session=False)
        
        # 3. Bulk Delete Laporan Utama
        deleted_count = db.query(Report).filter(Report.id.in_(report_ids)).delete(synchronize_session=False)
            
        db.commit()
        logger.info(f"Pembersihan retensi selesai. {deleted_count} data laporan lama dihapus.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error saat pembersihan retensi data: {e}")
    finally:
        db.close()
