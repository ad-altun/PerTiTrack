package org.pertitrack.backend.controller;

import org.pertitrack.backend.dto.CreateEmployeeRequest;
import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.dto.UpdateEmployeeRequest;
import org.pertitrack.backend.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }


    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

//    @GetMapping("/number/{employeeNumber}")
//    public ResponseEntity<EmployeeDto> getEmployeeByEmployeeNumber(@PathVariable String employeeNumber) {
//        return ResponseEntity.ok(employeeService.getEmployeeByEmployeeNumber(employeeNumber));
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<EmployeeDto> searchEmployeesByName(@RequestParam String name) {
//        return ResponseEntity.ok(employeeService.searchEmployeesByName(name));
//    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody CreateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable String id,
            @RequestBody UpdateEmployeeRequest request
    ) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        boolean deleted = employeeService.deleteEmployee(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

//    @PutMapping("/{id}/deactivate")
//    public ResponseEntity<EmployeeDto> deactivateEmployee(@PathVariable String id) {
//        return ResponseEntity.ok(employeeService.deactivateEmployee(id));
//    }
//
//    @PutMapping("/{id}/activate")
//    public ResponseEntity<EmployeeDto> activateEmployee(@PathVariable String id) {
//        return ResponseEntity.ok(employeeService.activateEmployee(id));
//    }

}
