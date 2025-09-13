package org.pertitrack.backend.service;

import org.springframework.stereotype.Service;

@Service
public class IdService {
    public String generateId() {
        return java.util.UUID.randomUUID().toString();
    }
}
