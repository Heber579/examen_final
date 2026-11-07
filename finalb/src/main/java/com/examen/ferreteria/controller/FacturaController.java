package com.examen.ferreteria.controller;

import com.examen.ferreteria.dto.DetalleFacturaDto;
import com.examen.ferreteria.service.FacturaService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/facturas")
public class FacturaController {

    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    @GetMapping("/reporteDetalle")
    public List<DetalleFacturaDto> reporteDetalle() {
        return facturaService.reporteDetalle();
    }
}
