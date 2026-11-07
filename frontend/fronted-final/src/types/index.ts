export interface Categoria {
  idCategoria: number
  estado: boolean
  nombre: string
  descripcion: string | null
}

export interface Articulo {
  idArticulo: number
  estado: boolean
  nombre: string
  marca: string | null
  precio: number
  stock: number
  idCategoria: Categoria | null
}

export interface ArticuloCategoria {
  nombreArticulo: string
  marca: string | null
  nombreCategoria: string
  precio: number
  stock: number
}

export interface ClienteFactura {
  nombre: string
  apellido: string
  nit: string
  fechaFactura: string
  total: number
}

export interface DetalleFactura {
  fechaFactura: string
  nombreCliente: string
  apellidoCliente: string
  nombreArticulo: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}