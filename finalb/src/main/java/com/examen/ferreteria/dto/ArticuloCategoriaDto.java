package com.examen.ferreteria.dto;

import java.math.BigDecimal;

public class ArticuloCategoriaDto {

    private String nombreArticulo;
    private String marca;
    private String nombreCategoria;
    private BigDecimal precio;
    private Integer stock;

    public ArticuloCategoriaDto(String nombreArticulo, String marca, String nombreCategoria,
            BigDecimal precio, Integer stock) {
        this.nombreArticulo = nombreArticulo;
        this.marca = marca;
        this.nombreCategoria = nombreCategoria;
        this.precio = precio;
        this.stock = stock;
    }

    public String getNombreArticulo() {
        return nombreArticulo;
    }

    public String getMarca() {
        return marca;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public Integer getStock() {
        return stock;
    }
}
