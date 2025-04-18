from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"mensaje": "¡API de ferretería activa!"}

@app.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    return crud.obtener_usuarios(db)

@app.post("/usuarios")
def crear_un_usuario(nombre: str, email: str, db: Session = Depends(get_db)):
    return crud.crear_usuario(db, nombre, email)
