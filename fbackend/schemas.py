from pydantic import BaseModel, EmailStr, condecimal
from enum import Enum
from datetime import datetime
from typing import List, Optional,Annotated
Precio = Annotated[condecimal(max_digits=10, decimal_places=2), ...]
#Tabla Usuario
class CargoEnum(str, Enum):
    gerente = "Gerente"
    cajero = "Cajero"
    cliente = "Cliente"

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    cargo: CargoEnum

class UsuarioCrear(UsuarioBase):
    contraseña: str

class UsuarioRespuesta(UsuarioBase):
    id_usuario: int
    fecha_registro: datetime

    class Config:
        from_attributes = True
#//////////////////////////////////////////


#Table Venta
class VentaBase(BaseModel):
    id_cajero: Optional[int] = None
    id_cliente: Optional[int] = 1
    total: float


class VentaCrear(VentaBase):
    pass

class VentaRespuesta(VentaBase):
    id_venta: int
    fecha: datetime

    class Config:
        from_attributes = True
#///////////////////////////////////////////
# Tabla DetalleVenta
class DetalleVentaBase(BaseModel):
    id_producto: int
    cantidad: int

class DetalleVentaCrear(DetalleVentaBase):
    pass

class DetalleVentaRespuesta(DetalleVentaBase):
    id_detalle_venta: int

    class Config:
        from_attributes = True

# ////////////////////////////////

# Tabla Proveedor
class ProveedorBase(BaseModel):
    nombre: str
    telefono:str
    direccion:str
    correo: EmailStr

class ProveedorCrear(ProveedorBase):
    pass

class ProveedorOut(BaseModel):
    id_proveedor: int
    nombre: str
    class Config:
        from_attributes = True

class ProveedorRespuesta(ProveedorBase):
    id_proveedor: int

    class Config:
        from_attributes = True

# ////////////////////////////////

# Tabla Producto
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    categoria: str
    precio: Precio
    stock: Optional[int] = 0
    imagen_url: Optional[str] = "https://drive.google.com/uc?id=1vkOKzW-RHrzhBgZ_Xk0fHeIQUj9ebRub"
    id_proveedor:int

class ProductoCrear(ProductoBase):
    pass

class ProductoActualizar(ProductoBase):
    pass

class ProductoRespuesta(BaseModel):
    id_producto: int
    nombre: str
    descripcion: Optional[str] = None
    categoria: str
    precio: Precio
    stock: Optional[int] = 0
    imagen_url: Optional[str] = "https://drive.google.com/uc?id=1vkOKzW-RHrzhBgZ_Xk0fHeIQUj9ebRub"
    proveedor:ProveedorOut
    class Config:
        from_attributes = True
# ////////////////////////////////

# Tabla OrdenCompra
class EstadoOrden(str, Enum):
    pendiente = "pendiente"
    aprobada = "aprobada"
    enviada = "enviada"
    recibida = "recibida"

class OrdenCompraBase(BaseModel):
    id_proveedor: int
    estado: EstadoOrden = EstadoOrden.pendiente

class OrdenCompraCrear(OrdenCompraBase):
    detalles: List["DetalleCompraCrear"]

class OrdenCompraRespuesta(OrdenCompraBase):
    id_orden_compra: int
    fecha: datetime
    detalles: List["DetalleCompraRespuesta"]

    class Config:
        from_attributes = True

# ////////////////////////////////


# Tabla DetalleCompra

class DetalleCompraBase(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: Precio

class DetalleCompraCrear(DetalleCompraBase):
    pass

class DetalleCompraRespuesta(DetalleCompraBase):
    id_detalle_compra: int

    class Config:
        from_attributes = True

# ////////////////////////////////

# Para que funcione el forward reference de OrdenCompraRespuesta:
OrdenCompraCrear.update_forward_refs()
OrdenCompraRespuesta.update_forward_refs()
