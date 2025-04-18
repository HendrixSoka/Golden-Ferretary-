from sqlalchemy.orm import Session
from models import Usuario

def obtener_usuarios(db: Session):
    return db.query(Usuario).all()

def crear_usuario(db: Session, nombre: str, email: str):
    nuevo_usuario = Usuario(nombre=nombre, email=email)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario
