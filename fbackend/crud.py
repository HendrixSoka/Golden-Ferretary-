from sqlalchemy.orm import Session
from models import Usuario,Venta,Proveedor, Producto, DetalleVenta, OrdenCompra, DetalleCompra
from schemas import UsuarioCrear,VentaCrear
from schemas import ProveedorCrear, ProductoCrear, DetalleVentaCrear,OrdenCompraCrear, DetalleCompraCrear
from sqlalchemy.orm import joinedload
from fastapi import UploadFile, File, Form
from typing import Optional
import os
import shutil
from drive_utils import subir_imagen_a_drive, eliminar_imagen_drive

# Tabla Usuario
def obtener_usuarios(db: Session):
    return db.query(Usuario).all()

def obtener_usuario(db: Session, id_usuario: int):
    return db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()

def crear_usuario(db: Session, usuario: UsuarioCrear):
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        contraseña=usuario.contraseña,
        cargo=usuario.cargo
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def actualizar_usuario(db: Session, id_usuario: int, datos: UsuarioCrear):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if usuario:
        usuario.nombre = datos.nombre
        usuario.correo = datos.correo
        if datos.contraseña: 
            usuario.contraseña = datos.contraseña
        usuario.cargo = datos.cargo
        db.commit()
        db.refresh(usuario)
    return usuario

def eliminar_usuario(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        return None

    if usuario.cargo == "Cliente":
        ventas = db.query(Venta).filter(Venta.id_cliente == id_usuario).all()
        for venta in ventas:
            venta.id_cliente = 1 
            if venta.id_cajero is None:
                db.delete(venta)

    elif usuario.cargo == "Cajero":
        ventas = db.query(Venta).filter(Venta.id_cajero == id_usuario).all()
        for venta in ventas:
            venta.id_cajero = None
            if venta.id_cliente == 1:
                db.delete(venta)

    db.delete(usuario)
    db.commit()
    return usuario

#///////////////////////////////////////////////////////////////////////////////////

#Table Venta
def crear_venta(db: Session, venta: VentaCrear):
    nueva_venta = Venta(**venta.dict())
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta


def obtener_venta(db: Session, id_venta: int):
    return db.query(Venta).filter(Venta.id_venta == id_venta).first()


def obtener_ventas(db: Session):
    return db.query(Venta).all()


def eliminar_venta(db: Session, id_venta: int):
    venta = db.query(Venta).filter(Venta.id_venta == id_venta).first()
    if venta:
        db.delete(venta)
        db.commit()
    return venta
#///////////////////////////////////////////////////////////////////////////////////
# Tabla DetalleVenta
def crear_detalle_venta(db: Session, detalle: DetalleVentaCrear):
    nuevo_detalle = DetalleVenta(**detalle.model_dump())
    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)
    return nuevo_detalle

def obtener_detalles_venta(db: Session):
    return db.query(DetalleVenta).all()

def obtener_detalle_venta_por_id(db: Session, id_detalle: int):
    return db.query(DetalleVenta).filter(DetalleVenta.id_detalle_venta == id_detalle).first()

def eliminar_detalle_venta(db: Session, id_detalle: int):
    detalle = db.query(DetalleVenta).filter(DetalleVenta.id_detalle_venta == id_detalle).first()
    if detalle:
        db.delete(detalle)
        db.commit()
    return detalle
#///////////////////////////////////////////////////////////////////////////////////
# Tabla proveedor
def obtener_proveedores(db: Session):
    return db.query(Proveedor).all()

def crear_proveedor(db: Session, proveedor: ProveedorCrear):
    nuevo = Proveedor(**proveedor.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def actualizar_proveedor(db: Session, id_proveedor: int, datos: ProveedorCrear):
    proveedor = db.query(Proveedor).get(id_proveedor)
    if proveedor is None:
        return None
    for campo, valor in datos.dict().items():
        setattr(proveedor, campo, valor)
    db.commit()
    return proveedor

def eliminar_proveedor(db: Session, id_proveedor: int):
    proveedor = db.query(Proveedor).get(id_proveedor)
    if proveedor is None:
        return None
    db.delete(proveedor)
    db.commit()
    return proveedor
#///////////////////////////////////////////////////////////////////////////////////
# Tabla producto
def obtener_productos(db: Session):
    return (
        db.query(Producto)
        .options(joinedload(Producto.proveedor))
        .filter(Producto.activo == True)
        .all()
    )
def crear_producto_con_imagen(
    db: Session,
    nombre: str,
    descripcion: Optional[str],
    categoria: str,
    precio: float,
    stock: int,
    id_proveedor: int,
    imagen: UploadFile
):
    # Guardar temporalmente
    temp_path = f"temp_{imagen.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(imagen.file, buffer)

    # Subir imagen a Google Drive
    url_imagen = subir_imagen_a_drive(temp_path, imagen.filename)

    # Eliminar archivo temporal
    os.remove(temp_path)

    # Crear producto
    nuevo = Producto(
        nombre=nombre,
        descripcion=descripcion,
        categoria=categoria,
        precio=precio,
        stock=stock,
        id_proveedor=id_proveedor,
        imagen_url=url_imagen
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

IMAGEN_POR_DEFECTO = "https://drive.google.com/uc?id=1vkOKzW-RHrzhBgZ_Xk0fHeIQUj9ebRub"

def actualizar_producto_service(
    db: Session,
    producto_id:int,
    nombre: str,
    descripcion: Optional[str],
    categoria: str,
    precio: float,
    id_proveedor: int,
    imagen_file: UploadFile
    ):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise Exception("Producto no encontrado")

    # Actualizar campos básicos
    producto.nombre = nombre
    producto.descripcion = descripcion
    producto.categoria = categoria
    producto.precio = precio
    producto.id_proveedor = id_proveedor

    if imagen_file:
        if producto.imagen_url and producto.imagen_url != IMAGEN_POR_DEFECTO:
            file_id = extraer_file_id_drive(producto.imagen_url)
            eliminar_imagen_drive(file_id)
        temp_path = f"temp_{imagen_file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(imagen_file.file, buffer)
        url_imagen = subir_imagen_a_drive(temp_path, imagen_file.filename)
        os.remove(temp_path)
        producto.imagen_url=url_imagen

    db.commit()
    db.refresh(producto)
    return producto
def extraer_file_id_drive(url):
    if "id=" in url:
        return url.split("id=")[-1]
    if "/file/d/" in url:
        return url.split("/file/d/")[1].split("/")[0]
    return ""

def eliminar_producto(db: Session, id_producto: int):
    producto = db.query(Producto).filter(Producto.id_producto == id_producto).first()
    if producto is None:
        return None
    producto.activo = False
    db.commit()
    db.refresh(producto)
    return producto
#///////////////////////////////////////////////////////////////////////////////////
# Tabla orden_compra
def obtener_ordenes_compra(db: Session):
    return db.query(OrdenCompra).all()

def crear_orden_compra(db: Session, orden: OrdenCompraCrear):
    nueva = OrdenCompra(**orden.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def actualizar_orden_compra(db: Session, id_orden: int, datos: OrdenCompraCrear):
    orden = db.query(OrdenCompra).get(id_orden)
    if orden is None:
        return None
    for campo, valor in datos.dict().items():
        setattr(orden, campo, valor)
    db.commit()
    return orden

def eliminar_orden_compra(db: Session, id_orden: int):
    orden = db.query(OrdenCompra).get(id_orden)
    if orden is None:
        return None
    db.delete(orden)
    db.commit()
    return orden
#///////////////////////////////////////////////////////////////////////////////////
# Tabla detalle_compra
def obtener_detalles_compra(db: Session):
    return db.query(DetalleCompra).all()

def crear_detalle_compra(db: Session, detalle: DetalleCompraCrear):
    nuevo = DetalleCompra(**detalle.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def actualizar_detalle_compra(db: Session, id_detalle: int, datos: DetalleCompraCrear):
    detalle = db.query(DetalleCompra).get(id_detalle)
    if detalle is None:
        return None
    for campo, valor in datos.dict().items():
        setattr(detalle, campo, valor)
    db.commit()
    return detalle

def eliminar_detalle_compra(db: Session, id_detalle: int):
    detalle = db.query(DetalleCompra).get(id_detalle)
    if detalle is None:
        return None
    db.delete(detalle)
    db.commit()
    return detalle
#///////////////////////////////////////////////////////////////////////////////////