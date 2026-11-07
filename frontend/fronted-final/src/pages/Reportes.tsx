import { useEffect, useRef, useState } from 'react'
import type { ArticuloCategoria, ClienteFactura, DetalleFactura } from '../types'
import {
  getArticulosCategoria,
  getArticulosPorNombre,
  getClientesFactura,
  getDetalleFacturas,
} from '../services/reportesService'
import { exportarExcel, exportarPdf } from '../utils/exportar'
import type { Columna, ConfigReporte, Fila } from '../utils/exportar'
import './Reportes.css'

const COLUMNAS_ARTICULOS: Columna[] = [
  { titulo: 'Artículo', ancho: 35 },
  { titulo: 'Marca', ancho: 20 },
  { titulo: 'Categoría', ancho: 28 },
  { titulo: 'Precio', ancho: 12, tipo: 'moneda' },
  { titulo: 'Stock', ancho: 10, tipo: 'entero' },
]

const COLUMNAS_FACTURAS: Columna[] = [
  { titulo: 'Cliente', ancho: 35 },
  { titulo: 'NIT', ancho: 16 },
  { titulo: 'Fecha', ancho: 20 },
  { titulo: 'Total', ancho: 14, tipo: 'moneda' },
]

const COLUMNAS_DETALLE: Columna[] = [
  { titulo: 'Fecha', ancho: 20 },
  { titulo: 'Cliente', ancho: 32 },
  { titulo: 'Artículo', ancho: 35 },
  { titulo: 'Cantidad', ancho: 10, tipo: 'entero' },
  { titulo: 'Precio unitario', ancho: 16, tipo: 'moneda' },
  { titulo: 'Subtotal', ancho: 14, tipo: 'moneda' },
]

type Formato = 'pdf' | 'excel'

function exportar(formato: Formato, config: ConfigReporte) {
  return formato === 'pdf' ? exportarPdf(config) : exportarExcel(config)
}

function Tabla({ columnas, filas }: { columnas: Columna[]; filas: Fila[] }) {
  const esNumero = (c: Columna) => c.tipo === 'moneda' || c.tipo === 'entero'
  return (
    <table>
      <thead>
        <tr>
          {columnas.map((c) => (
            <th key={c.titulo} className={esNumero(c) ? 'derecha' : ''}>{c.titulo}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            {fila.map((valor, j) => (
              <td key={j} className={esNumero(columnas[j]) ? 'derecha' : ''}>
                {columnas[j].tipo === 'moneda' ? Number(valor).toFixed(2) : valor}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Reportes() {
  const [articulosCat, setArticulosCat] = useState<ArticuloCategoria[]>([])
  const [clientesFactura, setClientesFactura] = useState<ClienteFactura[]>([])
  const [detalle, setDetalle] = useState<DetalleFactura[]>([])
  const [error, setError] = useState('')

  const dialogoRef = useRef<HTMLDialogElement>(null)
  const [filtro, setFiltro] = useState('')
  const [mensajeDialogo, setMensajeDialogo] = useState('')

  useEffect(() => {
    getArticulosCategoria().then(setArticulosCat).catch((e: Error) => setError(e.message))
    getClientesFactura().then(setClientesFactura).catch((e: Error) => setError(e.message))
    getDetalleFacturas().then(setDetalle).catch((e: Error) => setError(e.message))
  }, [])

  const filasArticulosCat: Fila[] = articulosCat.map((a) => [
    a.nombreArticulo, a.marca ?? '', a.nombreCategoria, a.precio, a.stock,
  ])

  const filasFacturas: Fila[] = clientesFactura.map((f) => [
    `${f.nombre} ${f.apellido}`, // nombre y apellido en una sola columna
    f.nit, f.fechaFactura, f.total,
  ])

  const filasDetalle: Fila[] = detalle.map((d) => [
    d.fechaFactura, `${d.nombreCliente} ${d.apellidoCliente}`, d.nombreArticulo,
    d.cantidad, d.precioUnitario, d.subtotal,
  ])

  async function exportarFiltrado(formato: Formato) {
    try {
      const lista = await getArticulosPorNombre(filtro)
      if (lista.length === 0) {
        setMensajeDialogo('No se encontraron artículos con ese nombre.')
        return
      }
      setMensajeDialogo('')
      const filas: Fila[] = lista.map((a) => [
        a.nombre, a.marca ?? '', a.idCategoria?.nombre ?? '', a.precio, a.stock,
      ])
      await exportar(formato, {
        titulo: 'Reporte de Artículos por Nombre',
        archivo: 'reporte1_articulos_por_nombre',
        columnas: COLUMNAS_ARTICULOS,
        filas,
      })
    } catch (e) {
      setMensajeDialogo((e as Error).message)
    }
  }

  return (
    <div className="reportes">
      <h1>Reportes</h1>
      {error && <p className="error">No se pudo conectar con el servidor: {error}</p>}

      {/* Reporte 1 */}
      <section>
        <h2>Reporte 1: Artículos por nombre</h2>
        <button onClick={() => dialogoRef.current?.showModal()}>Abrir filtro</button>

        <dialog ref={dialogoRef}>
          <h3>Artículos por nombre</h3>
          <input
            type="text"
            placeholder="Nombre del artículo (ej. martillo)"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          {mensajeDialogo && <p className="error">{mensajeDialogo}</p>}
          <button onClick={() => exportarFiltrado('pdf')}>Exportar a PDF</button>
          <button onClick={() => exportarFiltrado('excel')}>Exportar a Excel</button>
          <button className="secundario" onClick={() => dialogoRef.current?.close()}>Cerrar</button>
        </dialog>
      </section>

      {/* Reporte 2 */}
      <section>
        <h2>Reporte 2: Artículos con su categoría</h2>
        <button
          onClick={() => exportar('pdf', {
            titulo: 'Reporte de Artículos por Categoría',
            archivo: 'reporte2_articulos_categoria',
            columnas: COLUMNAS_ARTICULOS,
            filas: filasArticulosCat,
          })}
        >
          Exportar a PDF
        </button>
        <button
          onClick={() => exportar('excel', {
            titulo: 'Reporte de Artículos por Categoría',
            archivo: 'reporte2_articulos_categoria',
            columnas: COLUMNAS_ARTICULOS,
            filas: filasArticulosCat,
          })}
        >
          Exportar a Excel
        </button>
        <Tabla columnas={COLUMNAS_ARTICULOS} filas={filasArticulosCat} />
      </section>

      {/* Reporte 3 */}
      <section>
        <h2>Reporte 3: Facturas por cliente</h2>
        <button
          onClick={() => exportar('pdf', {
            titulo: 'Reporte de Facturas por Cliente',
            archivo: 'reporte3_facturas_cliente',
            columnas: COLUMNAS_FACTURAS,
            filas: filasFacturas,
          })}
        >
          Exportar a PDF
        </button>
        <button
          onClick={() => exportar('excel', {
            titulo: 'Reporte de Facturas por Cliente',
            archivo: 'reporte3_facturas_cliente',
            columnas: COLUMNAS_FACTURAS,
            filas: filasFacturas,
          })}
        >
          Exportar a Excel
        </button>
        <Tabla columnas={COLUMNAS_FACTURAS} filas={filasFacturas} />
      </section>

      {/* Reporte 4 */}
      <section>
        <h2>Reporte 4: Detalle de facturas</h2>
        <button
          onClick={() => exportar('pdf', {
            titulo: 'Reporte de Detalle de Facturas',
            archivo: 'reporte4_detalle_facturas',
            columnas: COLUMNAS_DETALLE,
            filas: filasDetalle,
            totalColumna: 5,
          })}
        >
          Exportar a PDF
        </button>
        <button
          onClick={() => exportar('excel', {
            titulo: 'Reporte de Detalle de Facturas',
            archivo: 'reporte4_detalle_facturas',
            columnas: COLUMNAS_DETALLE,
            filas: filasDetalle,
            totalColumna: 5,
          })}
        >
          Exportar a Excel
        </button>
        <Tabla columnas={COLUMNAS_DETALLE} filas={filasDetalle} />
      </section>
    </div>
  )
}