package org.pertitrack.backend.service;

import org.pertitrack.backend.dto.*;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.personnel.*;
import org.pertitrack.backend.exceptions.*;
import org.pertitrack.backend.mapper.*;
import org.pertitrack.backend.repository.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.util.*;
import java.util.stream.*;

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

    @Transactional(readOnly = true)
    public boolean employeeExistsForUser(String userId) {
        return employeeRepository.findByUserId(userId).isPresent();
    }

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

        // Handle case where employee might not be linked to a user
        String userId = null;
        String userEmail = null;
        String userFullName = null;

        if (saved.getUser() != null) {
            userId = saved.getUser().getId();
            userEmail = saved.getUser().getEmail();
            userFullName = saved.getUser().getFullName();
        }

//        return employeeMapper.toDto(saved);

        return new EmployeeDto(
                saved.getId(),
                saved.getEmployeeNumber(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getFullName(),
                saved.getIsActive(),
                userId,
                userEmail,
                userFullName
        );

    }

    public EmployeeDto updateEmployee(String id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found: ", id));

        if (request.getFirstName() != null) {
            employee.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            employee.setLastName(request.getLastName());
        }

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


     // Creates an employee record for a newly registered user (automatic creation)
     // This method is called during user registration process
     // @param user The user for whom to create an employee record

    public void createEmployeeForNewUser(User user) {
        // Check if employee already exists for this user
        if (employeeRepository.findByUserId(user.getId()).isPresent()) {
            return; // Employee already exists, skip creation
        }

        Employee employee = new Employee();
        employee.setId(idService.generateId());
        employee.setUser(user);
        employee.setEmployeeNumber(generateNextEmployeeNumber());
        employee.setFirstName(user.getFirstName());
        employee.setLastName(user.getLastName());
        employee.setIsActive(true);

        employeeRepository.save(employee);
    }

    /**
     * Generates the next sequential employee number
     * @return Next employee number in format 0041, 0042, etc.
     */
    private String generateNextEmployeeNumber() {
        // Find the employee with the highest employee number
        Optional<Employee> lastEmployee = employeeRepository.findTopByOrderByEmployeeNumberDesc();

        int nextEmployeeNumber;
        if (lastEmployee.isPresent()) {
            // Parse the current highest number and increment
            String currentMaxNumber = lastEmployee.get().getEmployeeNumber();
            try {
                int currentMax = Integer.parseInt(currentMaxNumber);
                nextEmployeeNumber = currentMax + 1;
            } catch (NumberFormatException e) {
                // If parsing fails, start from 41 (first employee will be 0041)
                nextEmployeeNumber = 41;
            }
        } else {
            // No employees exist yet, start from 41 (first employee will be 0041)
            nextEmployeeNumber = 41;
        }

        // Format as 4-digit number with leading zeros
        return String.format("%04d", nextEmployeeNumber);
    }

}