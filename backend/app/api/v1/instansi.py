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

@router.put("/{instansi_id}", response_model=InstansiResponse)
def update_instansi(instansi_id: int, instansi: InstansiCreate, db: Session = Depends(get_db)):
    db_instansi = db.query(Instansi).filter(Instansi.id == instansi_id).first()
    if not db_instansi:
        raise HTTPException(status_code=404, detail="Instansi tidak ditemukan")
    
    # Cek duplikat nama instansi
    if instansi.nama != db_instansi.nama:
        duplicate = db.query(Instansi).filter(Instansi.nama == instansi.nama).first()
        if duplicate:
            raise HTTPException(status_code=400, detail="Instansi dengan nama tersebut sudah ada")
            
    db_instansi.nama = instansi.nama
    db_instansi.deskripsi = instansi.deskripsi
    db.commit()
    db.refresh(db_instansi)
    return {
        "id": db_instansi.id,
        "nama": db_instansi.nama,
        "deskripsi": db_instansi.deskripsi,
        "created_at": db_instansi.created_at.isoformat()
    }
