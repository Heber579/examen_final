import api from '../api/axios'
import type { Articulo, ArticuloCategoria, ClienteFactura, DetalleFactura } from '../types'

export function getArticulosPorNombre(nombre: string) {
  return api
    .get<Articulo[]>('/articulos/mostrarActivosFiltro', { params: { nombre } })
    .then((res) => res.data)
}

export function getArticulosCategoria() {
  return api
    .get<ArticuloCategoria[]>('/articulos/reporteArticuloCategoria')
    .then((res) => res.data)
}

export function getClientesFactura() {
  return api
    .get<ClienteFactura[]>('/clientes/reporteClienteFactura')
    .then((res) => res.data)
}

export function getDetalleFacturas() {
  return api
    .get<DetalleFactura[]>('/facturas/reporteDetalle')
    .then((res) => res.data)
}