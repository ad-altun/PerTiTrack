package org.pertitrack.backend.repository;

import org.pertitrack.backend.entity.personnel.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findEmployeeByEmployeeNumber(String employeeNumber);

    Optional<Object> findByUserId(String userId);

    Optional<Employee> findTopByOrderByEmployeeNumberDesc();

}
