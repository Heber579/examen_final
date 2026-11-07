package com.examen.ferreteria.service;

import com.examen.ferreteria.dto.ClienteFacturaDto;
import com.examen.ferreteria.repository.ClienteRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteFacturaDto> reporteClienteFactura() {
        return clienteRepository.reporteClienteFactura();
    }
}
