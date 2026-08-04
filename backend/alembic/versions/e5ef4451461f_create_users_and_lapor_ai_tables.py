"""create_users_and_lapor_ai_tables

Revision ID: e5ef4451461f
Revises: 
Create Date: 2026-08-05 00:12:52.887178

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'e5ef4451461f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nama', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('instansi', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Email Verifications Table
    op.create_table(
        'email_verifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('otp_code', sa.String(), nullable=False),
        sa.Column('expired_at', sa.DateTime(), nullable=False),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('last_requested_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_email_verifications_email'), 'email_verifications', ['email'], unique=False)
    op.create_index(op.f('ix_email_verifications_id'), 'email_verifications', ['id'], unique=False)

    # Reports Table
    op.create_table(
        'reports',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('pelapor_email', sa.String(), nullable=True),
        sa.Column('is_anonim', sa.Boolean(), nullable=True),
        sa.Column('email_verified', sa.Boolean(), nullable=True),
        sa.Column('deskripsi_asli', sa.Text(), nullable=False),
        sa.Column('deskripsi_masked', sa.Text(), nullable=False),
        sa.Column('text_fingerprint', sa.String(), nullable=False),
        sa.Column('kategori', sa.String(), nullable=True),
        sa.Column('skor_urgensi', sa.String(), nullable=True),
        sa.Column('alasan_urgensi', sa.Text(), nullable=True),
        sa.Column('ringkasan', sa.Text(), nullable=True),
        sa.Column('bahasa_terdeteksi', sa.String(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('entitas', sa.JSON(), nullable=True),
        sa.Column('lokasi_alamat', sa.String(), nullable=True),
        sa.Column('lokasi_lat', sa.Float(), nullable=True),
        sa.Column('lokasi_lng', sa.Float(), nullable=True),
        sa.Column('lampiran_path', sa.String(), nullable=True),
        sa.Column('dinas_tujuan', sa.String(), nullable=True),
        sa.Column('is_duplikat', sa.Boolean(), nullable=True),
        sa.Column('duplikat_of_id', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reports_id'), 'reports', ['id'], unique=False)
    op.create_index(op.f('ix_reports_text_fingerprint'), 'reports', ['text_fingerprint'], unique=False)

    # AI Analysis Logs Table
    op.create_table(
        'ai_analysis_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.String(), nullable=False),
        sa.Column('model_used', sa.String(), nullable=False),
        sa.Column('provider', sa.String(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=True),
        sa.Column('raw_prompt', sa.Text(), nullable=True),
        sa.Column('raw_response', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['report_id'], ['reports.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ai_analysis_logs_id'), 'ai_analysis_logs', ['id'], unique=False)

    # Feedbacks Table
    op.create_table(
        'feedbacks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.String(), nullable=False),
        sa.Column('petugas_id', sa.Integer(), nullable=False),
        sa.Column('keputusan_akhir', sa.String(), nullable=False),
        sa.Column('koreksi_ai', sa.Boolean(), nullable=True),
        sa.Column('kategori_lama', sa.String(), nullable=True),
        sa.Column('kategori_baru', sa.String(), nullable=True),
        sa.Column('urgensi_lama', sa.String(), nullable=True),
        sa.Column('urgensi_baru', sa.String(), nullable=True),
        sa.Column('catatan', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['petugas_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['report_id'], ['reports.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_feedbacks_id'), 'feedbacks', ['id'], unique=False)

    # Audit Logs Table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.String(), nullable=True),
        sa.Column('actor', sa.String(), nullable=False),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('model_version', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_feedbacks_id'), table_name='feedbacks')
    op.drop_table('feedbacks')
    op.drop_index(op.f('ix_ai_analysis_logs_id'), table_name='ai_analysis_logs')
    op.drop_table('ai_analysis_logs')
    op.drop_index(op.f('ix_reports_text_fingerprint'), table_name='reports')
    op.drop_index(op.f('ix_reports_id'), table_name='reports')
    op.drop_table('reports')
    op.drop_index(op.f('ix_email_verifications_id'), table_name='email_verifications')
    op.drop_index(op.f('ix_email_verifications_email'), table_name='email_verifications')
    op.drop_table('email_verifications')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
