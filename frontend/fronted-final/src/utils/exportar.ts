import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from 'exceljs'

export interface Columna {
  titulo: string
  ancho: number 
  tipo?: 'texto' | 'entero' | 'moneda' 
}

export type Fila = (string | number)[]

export interface ConfigReporte {
  titulo: string
  archivo: string 
  columnas: Columna[]
  filas: Fila[]
  totalColumna?: number 
}

const COLOR_PDF = [30, 64, 175] as [number, number, number]
const COLOR_EXCEL = 'FF1E40AF'

function fechaHoy(): string {
  return new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function sumar(filas: Fila[], columna: number): number {
  const suma = filas.reduce((acc, fila) => acc + Number(fila[columna]), 0)
  return Math.round(suma * 100) / 100
}

function cargarLogo(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = '/logo.png' 
  })
}

function descargar(blob: Blob, nombreArchivo: string) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}

export async function exportarPdf(config: ConfigReporte) {
  const { titulo, archivo, columnas, filas, totalColumna } = config
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const anchoPagina = doc.internal.pageSize.getWidth()
  const altoPagina = doc.internal.pageSize.getHeight()

  const logo = await cargarLogo()
  if (logo) doc.addImage(logo, 'PNG', 14, 8, 20, 20)
  doc.setFontSize(18)
  doc.setTextColor(...COLOR_PDF)
  doc.text(titulo, anchoPagina / 2, 18, { align: 'center' })
  doc.setFontSize(10)
  doc.setTextColor(80)
  doc.text(`Fecha: ${fechaHoy()}`, anchoPagina - 14, 18, { align: 'right' })

  const cuerpo = filas.map((fila) =>
    fila.map((valor, i) => (columnas[i].tipo === 'moneda' ? Number(valor).toFixed(2) : String(valor))),
  )

  const estilosColumnas: Record<number, { halign: 'right' }> = {}
  columnas.forEach((col, i) => {
    if (col.tipo === 'moneda' || col.tipo === 'entero') estilosColumnas[i] = { halign: 'right' }
  })

  let pie
  if (totalColumna !== undefined) {
    const celdas: (string | { content: string; colSpan?: number; styles?: { halign: 'right' } })[] = []
    if (totalColumna > 0) {
      celdas.push({ content: 'Total general', colSpan: totalColumna, styles: { halign: 'right' } })
    }
    celdas.push({ content: sumar(filas, totalColumna).toFixed(2), styles: { halign: 'right' } })
    for (let i = totalColumna + 1; i < columnas.length; i++) celdas.push('')
    pie = [celdas]
  }

  autoTable(doc, {
    startY: 32,
    head: [columnas.map((c) => c.titulo)],
    body: cuerpo,
    foot: pie,
    showFoot: 'lastPage',
    theme: 'grid',
    headStyles: { fillColor: COLOR_PDF, textColor: 255 },
    footStyles: { fillColor: [219, 234, 254], textColor: 20, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: estilosColumnas,
    margin: { left: 14, right: 14, bottom: 15 },
  })

  const totalPaginas = doc.getNumberOfPages()
  doc.setFontSize(9)
  doc.setTextColor(100)
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.text(`Página ${i} de ${totalPaginas}`, anchoPagina / 2, altoPagina - 8, { align: 'center' })
  }

  doc.save(`${archivo}.pdf`)
}

export async function exportarExcel(config: ConfigReporte) {
  const { titulo, archivo, columnas, filas, totalColumna } = config
  const libro = new ExcelJS.Workbook()
  const hoja = libro.addWorksheet('Reporte')
  const borde = { style: 'thin' as const }
  const bordes = { top: borde, left: borde, bottom: borde, right: borde }

  columnas.forEach((col, i) => {
    hoja.getColumn(i + 1).width = col.ancho
  })

  hoja.mergeCells(1, 1, 1, columnas.length)
  const celdaTitulo = hoja.getCell(1, 1)
  celdaTitulo.value = titulo
  celdaTitulo.font = { bold: true, size: 16, color: { argb: COLOR_EXCEL } }
  celdaTitulo.alignment = { horizontal: 'center' }

  hoja.mergeCells(2, 1, 2, columnas.length)
  const celdaFecha = hoja.getCell(2, 1)
  celdaFecha.value = `Fecha: ${fechaHoy()}`
  celdaFecha.alignment = { horizontal: 'right' }

  const filaEncabezado = 4
  columnas.forEach((col, i) => {
    const celda = hoja.getCell(filaEncabezado, i + 1)
    celda.value = col.titulo
    celda.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_EXCEL } }
    celda.alignment = { horizontal: 'center' }
    celda.border = bordes
  })

  const primeraFila = filaEncabezado + 1
  filas.forEach((fila, f) => {
    fila.forEach((valor, c) => {
      const celda = hoja.getCell(primeraFila + f, c + 1)
      celda.value = valor
      celda.border = bordes
      if (columnas[c].tipo === 'moneda') celda.numFmt = '#,##0.00'
      if (columnas[c].tipo === 'entero') celda.numFmt = '0'
    })
  })

  if (totalColumna !== undefined) {
    const ultimaFila = primeraFila + filas.length - 1
    const filaTotal = ultimaFila + 1
    const letra = hoja.getColumn(totalColumna + 1).letter

    if (totalColumna > 1) hoja.mergeCells(filaTotal, 1, filaTotal, totalColumna)
    if (totalColumna > 0) {
      const etiqueta = hoja.getCell(filaTotal, 1)
      etiqueta.value = 'Total general'
      etiqueta.font = { bold: true }
      etiqueta.alignment = { horizontal: 'right' }
    }
    const celdaSuma = hoja.getCell(filaTotal, totalColumna + 1)
    celdaSuma.value = {
      formula: `SUM(${letra}${primeraFila}:${letra}${ultimaFila})`,
      result: sumar(filas, totalColumna),
    }
    celdaSuma.numFmt = '#,##0.00'
    celdaSuma.font = { bold: true }

    columnas.forEach((_, i) => {
      const celda = hoja.getCell(filaTotal, i + 1)
      celda.border = bordes
      celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } }
    })
  }

  const buffer = await libro.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  descargar(blob, `${archivo}.xlsx`)
}