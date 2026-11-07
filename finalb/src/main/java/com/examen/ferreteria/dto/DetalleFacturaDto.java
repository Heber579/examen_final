package com.examen.ferreteria.dto;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DetalleFacturaDto {

    private String fechaFactura;
    private String nombreCliente;
    private String apellidoCliente;
    private String nombreArticulo;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    public DetalleFacturaDto(Date fechaFactura, String nombreCliente, String apellidoCliente,
            String nombreArticulo, Integer cantidad,
            BigDecimal precioUnitario, BigDecimal subtotal) {
        this.fechaFactura = fechaFactura == null ? ""
                : new SimpleDateFormat("dd/MM/yyyy HH:mm").format(fechaFactura);
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.nombreArticulo = nombreArticulo;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public String getFechaFactura() {
        return fechaFactura;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public String getApellidoCliente() {
        return apellidoCliente;
    }

    public String getNombreArticulo() {
        return nombreArticulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
}
