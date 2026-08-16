from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.report import Instansi
from app.schemas.report import InstansiCreate, InstansiResponse

router = APIRouter()

@router.get("", response_model=List[InstansiResponse])
def get_instansi_list(db: Session = Depends(get_db)):
    instansis = db.query(Instansi).all()
    # Serialize to match InstansiResponse (especially datetime to str)
    return [
        {
            "id": i.id,
            "nama": i.nama,
            "deskripsi": i.deskripsi,
            "created_at": i.created_at.isoformat()
        } for i in instansis
    ]

@router.post("", response_model=InstansiResponse)
def create_instansi(instansi: InstansiCreate, db: Session = Depends(get_db)):
    db_instansi = db.query(Instansi).filter(Instansi.nama == instansi.nama).first()
    if db_instansi:
        raise HTTPException(status_code=400, detail="Instansi sudah ada")
    
    new_instansi = Instansi(nama=instansi.nama, deskripsi=instansi.deskripsi)
    db.add(new_instansi)
    db.commit()
    db.refresh(new_instansi)
    return {
        "id": new_instansi.id,
        "nama": new_instansi.nama,
        "deskripsi": new_instansi.deskripsi,
        "created_at": new_instansi.created_at.isoformat()
    }

@router.delete("/{instansi_id}")
def delete_instansi(instansi_id: int, db: Session = Depends(get_db)):
    db_instansi = db.query(Instansi).filter(Instansi.id == instansi_id).first()
    if not db_instansi:
        raise HTTPException(status_code=404, detail="Instansi tidak ditemukan")
    
    db.delete(db_instansi)
    db.commit()
    return {"message": "Instansi berhasil dihapus"}
