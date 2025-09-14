package org.pertitrack.backend.service;

import org.pertitrack.backend.dto.CreateEmployeeRequest;
import org.pertitrack.backend.dto.EmployeeDto;
import org.pertitrack.backend.dto.UpdateEmployeeRequest;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.Employee;
import org.pertitrack.backend.exceptions.EmployeeAlreadyExistException;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.mapper.EmployeeMapper;
import org.pertitrack.backend.repository.EmployeeRepository;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final EmployeeMapper employeeMapper;
    private final IdService idService;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository,
                           EmployeeMapper employeeMapper,
                           IdService idService) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.employeeMapper = employeeMapper;
        this.idService = idService;
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .map(employeeMapper::toDto)
                .orElseThrow(() -> new EmployeeNotFoundException(id, "Employee not found: "));
    }


//    @Transactional(readOnly = true)
//    public EmployeeDto getEmployeeByEmployeeNumber(String employeeNumber) {
//        return employeeRepository.findEmployeeByEmployeeNumber(employeeNumber)
//                .map(employeeMapper::toDto)
//                .orElseThrow(() -> new EmployeeNotFoundException(employeeNumber));
//    }
//
//    @Transactional(readOnly = true)
//    public EmployeeDto searchEmployeesByName(String employeeName) {
//        return employeeRepository.findByFirstNameContaining(employeeName)
//                .map(employeeMapper::toDto)
//                .orElseThrow(() -> new EmployeeNotFoundException(employeeName));
//    }

    public EmployeeDto createEmployee(CreateEmployeeRequest request) { // check if the employee number already exist
        if (employeeRepository.findEmployeeByEmployeeNumber(request.getEmployeeNumber()).isPresent()) {
            throw new EmployeeAlreadyExistException(request.getEmployeeNumber(), "Employee already exists: ");
        }

        String id = idService.generateId();
        String fullName = request.getFirstName() + " " + request.getLastName();

        Employee employee = new Employee();
        employee.setId(id);
        employee.setEmployeeNumber(request.getEmployeeNumber());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setFullName(fullName);
        employee.setIsActive(true);

        // link employee to user
        if(request.getUserId() != null) {
            User newEmployee = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "User not found with ID: " + request.getUserId()
                    ));
            employee.setUser(newEmployee);
        }

        Employee saved = employeeRepository.save(employee);

        return new EmployeeDto(
                saved.getId(),
                saved.getEmployeeNumber(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getFullName(),
                saved.getIsActive(),
                saved.getUser().getId(),
                saved.getUser().getEmail(),
                saved.getUser().getFullName()
        );

    }

    public EmployeeDto updateEmployee(String id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found: ", id));

        employee.setEmployeeNumber(request.getEmployeeNumber());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setIsActive(request.isActive());

        Employee updated = employeeRepository.save(employee);

        return employeeMapper.toDto(updated);
    }

//    public EmployeeDto activateEmployee(String employeeId) {
//        Employee employee = employeeRepository.findById(employeeId)
//                .orElseThrow(() -> new EmployeeNotFoundException(
//                        "Employee with id " + employeeId + " not found!"));
//
//        employee.setIsActive(false);
//        Employee updated = employeeRepository.save(employee);
//
//        return employeeMapper.toDto(updated);
//    }
//
//    public EmployeeDto deactivateEmployee(String id) {
//        Employee employee = employeeRepository.findById(id)
//                .orElseThrow(() -> new EmployeeNotFoundException(id));
//
//        employee.setIsActive(false);
//        Employee updated = employeeRepository.save(employee);
//
//        return employeeMapper.toDto(updated);
//    }


    public boolean deleteEmployee(String employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            return false;
        }
        employeeRepository.deleteById(employeeId);
        return true;
    }

}