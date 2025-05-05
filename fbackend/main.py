from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi import UploadFile, File, Form


import models, crud
from database import SessionLocal, engine
from schemas import *
from models import *
from crud import *
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"mensaje": "¡API de ferretería activa!"}


#Tabla Usuario 
# GET: Listar usuarios
@app.get("/usuarios", response_model=List[UsuarioRespuesta])
def listar_usuarios(db: Session = Depends(get_db)):
    return crud.obtener_usuarios(db)

# GET: Obtener un usuario por ID
@app.get("/usuarios/{id_usuario}", response_model=UsuarioRespuesta)
def obtener_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = crud.obtener_usuario(db, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    return usuario

# POST: Crear un nuevo usuario
@app.post("/usuarios", response_model=UsuarioRespuesta)
def crear_un_usuario(usuario: UsuarioCrear, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.correo == usuario.correo).first()
    if existente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    return crud.crear_usuario(db, usuario)

# PUT: Actualizar un usuario
@app.put("/usuarios/{id_usuario}", response_model=UsuarioRespuesta)
def actualizar_usuario(id_usuario: int, usuario: UsuarioCrear, db: Session = Depends(get_db)):
    actualizado = crud.actualizar_usuario(db, id_usuario, usuario)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    return actualizado

# DELETE: Eliminar un usuario
@app.delete("/usuarios/{id_usuario}", status_code=204)
def eliminar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    print("Intentando eliminar usuario:", id_usuario)
    eliminado = crud.eliminar_usuario(db, id_usuario)
    print("Resultado de eliminado:", eliminado)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    return {"mensaje": "Usuario eliminado exitosamente."}


#/////////////////////////////////////////////////////////////////////////////////////
#Tabla Venta
@app.post("/ventas/")
def crear_venta_endpoint(venta: VentaCrear, db: Session = Depends(get_db)):
    return crear_venta(db, venta)

@app.get("/ventas/",response_model=List[VentaRespuesta])
def listar_ventas(db: Session = Depends(get_db)):
    return obtener_ventas(db)

@app.get("/ventas/{id_venta}",response_model=VentaRespuesta)
def obtener_venta_endpoint(id_venta: int, db: Session = Depends(get_db)):
    venta = obtener_venta(db, id_venta)
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta

@app.delete("/ventas/{id_venta}")
def eliminar_venta_endpoint(id_venta: int, db: Session = Depends(get_db)):
    venta = eliminar_venta(db, id_venta)
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta
#//////////////////////////////////////////////

#Tabla DetalleVenta
@app.post("/detalles_venta/")
def crear_detalle_venta_endpoint(detalle: DetalleVentaCrear, db: Session = Depends(get_db)):
    return crear_detalle_venta(db, detalle)

@app.get("/detalles_venta/",response_model=List[DetalleVentaRespuesta])
def listar_detalles_venta(db: Session = Depends(get_db)):
    return obtener_detalles_venta(db)

@app.get("/detalles_venta/{id_detalle}")
def obtener_detalle_venta_endpoint(id_detalle: int, db: Session = Depends(get_db)):
    detalle = obtener_detalle_venta_por_id(db, id_detalle)
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle

@app.delete("/detalles_venta/{id_detalle}")
def eliminar_detalle_venta_endpoint(id_detalle: int, db: Session = Depends(get_db)):
    detalle = eliminar_detalle_venta(db, id_detalle)
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle
#//////////////////////////////////////////////

#Tabla Proveedor
@app.get("/proveedores/",response_model=List[ProveedorRespuesta])
def listar_proveedores(db: Session = Depends(get_db)):
    return obtener_proveedores(db)

@app.post("/proveedores/")
def crear_proveedor_endpoint(proveedor: ProveedorCrear, db: Session = Depends(get_db)):
    return crear_proveedor(db, proveedor)

@app.put("/proveedores/{id_proveedor}")
def actualizar_proveedor_endpoint(id_proveedor: int, datos: ProveedorCrear, db: Session = Depends(get_db)):
    proveedor = actualizar_proveedor(db, id_proveedor, datos)
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

@app.delete("/proveedores/{id_proveedor}")
def eliminar_proveedor_endpoint(id_proveedor: int, db: Session = Depends(get_db)):
    proveedor = eliminar_proveedor(db, id_proveedor)
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor
#//////////////////////////////////////////////

#Tabla Producto
@app.get("/productos/", response_model=List[ProductoRespuesta])
def listar_productos(db: Session = Depends(get_db)):
    return obtener_productos(db)

@app.post("/productos/")
def crear_producto_endpoint(
    nombre: str = Form(...),
    descripcion: str = Form(None),
    categoria: str = Form(...),
    precio: float = Form(...),
    stock: int = Form(0),
    id_proveedor: int = Form(...),
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return crear_producto_con_imagen(
        db, nombre, descripcion, categoria, precio, stock, id_proveedor, imagen
    )

@app.put("/productos/{id_producto}")
def actualizar_producto(
    id_producto:int,
    nombre: str = Form(...),
    descripcion: str = Form(...),
    categoria: str = Form(...),
    precio: float = Form(...),
    id_proveedor: int = Form(...),
    imagen: Optional[UploadFile] = None,
    db: Session = Depends(get_db)
):
    try:
        return actualizar_producto_service(
            db,id_producto,nombre,descripcion,categoria,precio,id_proveedor,imagen
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/productos/{id_producto}")
def eliminar_producto_endpoint(id_producto: int, db: Session = Depends(get_db)):
    producto = eliminar_producto(db, id_producto)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto
#//////////////////////////////////////////////

#Tabla OrdenCompra
@app.get("/ordenes_compra/",response_model=List[OrdenCompraRespuesta])
def listar_ordenes_compra(db: Session = Depends(get_db)):
    return obtener_ordenes_compra(db)

@app.post("/ordenes_compra/")
def crear_orden_compra_endpoint(orden: OrdenCompraCrear, db: Session = Depends(get_db)):
    return crear_orden_compra(db, orden)

@app.put("/ordenes_compra/{id_orden}")
def actualizar_orden_compra_endpoint(id_orden: int, datos: OrdenCompraCrear, db: Session = Depends(get_db)):
    orden = actualizar_orden_compra(db, id_orden, datos)
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return orden

@app.delete("/ordenes_compra/{id_orden}")
def eliminar_orden_compra_endpoint(id_orden: int, db: Session = Depends(get_db)):
    orden = eliminar_orden_compra(db, id_orden)
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return orden
#//////////////////////////////////////////////

#Tabla DetalleCompra
@app.get("/detalles_compra/",response_model=List[DetalleCompraRespuesta])
def listar_detalles_compra(db: Session = Depends(get_db)):
    return obtener_detalles_compra(db)

@app.post("/detalles_compra/")
def crear_detalle_compra_endpoint(detalle: DetalleCompraCrear, db: Session = Depends(get_db)):
    return crear_detalle_compra(db, detalle)

@app.put("/detalles_compra/{id_detalle}")
def actualizar_detalle_compra_endpoint(id_detalle: int, datos: DetalleCompraCrear, db: Session = Depends(get_db)):
    detalle = actualizar_detalle_compra(db, id_detalle, datos)
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle

@app.delete("/detalles_compra/{id_detalle}")
def eliminar_detalle_compra_endpoint(id_detalle: int, db: Session = Depends(get_db)):
    detalle = eliminar_detalle_compra(db, id_detalle)
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle
#//////////////////////////////////////////////
