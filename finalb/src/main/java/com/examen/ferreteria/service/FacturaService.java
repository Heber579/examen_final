package com.examen.ferreteria.service;

import com.examen.ferreteria.dto.DetalleFacturaDto;
import com.examen.ferreteria.repository.FacturaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FacturaService {

    private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    public List<DetalleFacturaDto> reporteDetalle() {
        return facturaRepository.reporteDetalle();
    }
}
