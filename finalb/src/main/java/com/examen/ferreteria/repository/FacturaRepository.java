package com.examen.ferreteria.repository;

import com.examen.ferreteria.dto.DetalleFacturaDto;
import com.examen.ferreteria.entity.Factura;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FacturaRepository extends JpaRepository<Factura, Integer> {

    @Query("SELECT new com.examen.ferreteria.dto.DetalleFacturaDto("
         + "f.fechaFactura, c.nombre, c.apellido, a.nombre, "
         + "d.cantidad, d.precioUnitario, d.subtotal) "
         + "FROM FacturaDetalle d "
         + "JOIN d.idFactura f "
         + "JOIN f.idCliente c "
         + "JOIN d.idArticulo a "
         + "WHERE f.estado = true "
         + "ORDER BY f.fechaFactura, f.idFactura")
    List<DetalleFacturaDto> reporteDetalle();
}
