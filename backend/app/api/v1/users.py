from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.report import User, AuditLog
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.auth_service import auth_service
from app.core.rate_limiter import limiter
from app.core.security import require_roles, get_current_user

router = APIRouter(prefix="/users", tags=["User Management (Admin)"])

@router.get("", response_model=List[UserResponse])
@limiter.limit("20/minute")
def get_users(
    request: Request,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return users

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def create_user(
    request: Request,
    req: UserCreate,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    email_clean = req.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        
    hashed_pwd = auth_service.hash_password(req.password)
    new_user = User(
        nama=req.nama,
        email=email_clean,
        hashed_password=hashed_pwd,
        role=req.role,
        instansi=req.instansi
    )
    db.add(new_user)
    
    audit = AuditLog(
        actor=current_user.nama or "Admin",
        action="CREATE_USER",
        details=f"Admin {current_user.email} created user {email_clean} ({req.role})",
        model_version="Management"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=UserResponse)
@limiter.limit("10/minute")
def update_user(
    request: Request,
    user_id: int,
    req: UserUpdate,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    if req.nama is not None:
        user.nama = req.nama
    if req.role is not None:
        user.role = req.role
    if req.instansi is not None:
        user.instansi = req.instansi
    if req.password:
        user.hashed_password = auth_service.hash_password(req.password)
        
    audit = AuditLog(
        actor=current_user.nama or "Admin",
        action="UPDATE_USER",
        details=f"Admin {current_user.email} updated user {user.email}",
        model_version="Management"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("10/minute")
def delete_user(
    request: Request,
    user_id: int,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Tidak dapat menghapus diri sendiri")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    audit = AuditLog(
        actor=current_user.nama or "Admin",
        action="DELETE_USER",
        details=f"Admin {current_user.email} deleted user {user.email}",
        model_version="Management"
    )
    db.add(audit)
    
    db.delete(user)
    db.commit()
    return
