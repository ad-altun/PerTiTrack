package org.pertitrack.backend.repository;

import org.pertitrack.backend.entity.personnel.*;
import org.pertitrack.backend.entity.timetrack.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import java.time.*;
import java.util.*;

@Repository
public interface TimeRecordRepository extends JpaRepository<TimeRecord, String> {

    List<TimeRecord> findByEmployeeId(String employeeId);

    boolean existsByEmployeeAndRecordDateAndRecordType(Employee employee, LocalDate recordDate, TimeRecord.RecordType recordType);

    Optional<TimeRecord> findLatestByEmployeeAndRecordDateAndRecordType(
            Employee employee, LocalDate recordDate, TimeRecord.RecordType recordType);

    List<TimeRecord>
    findByEmployeeAndRecordDateBetweenAndRecordTypeOrderByRecordTimeDesc(
            Employee currentEmployee,
            LocalDate fromDate,
            LocalDate toDate,
            TimeRecord.RecordType recordType
    );

    List<TimeRecord>
    findByEmployeeAndRecordDateBetweenOrderByRecordTimeDesc(
            Employee currentEmployee,
            LocalDate fromDate, LocalDate toDate
    );

    List<TimeRecord>
    findByEmployeeAndRecordDateOrderByRecordTimeDesc(
            Employee currentEmployee,
            LocalDate today
    );

    Optional<TimeRecord>
    findTopByEmployeeAndRecordDateAndRecordTypeOrderByRecordTimeDesc(
            Employee employee,
            LocalDate date, TimeRecord.RecordType recordType
    );

    Optional<TimeRecord>
    findTopByEmployeeAndRecordDateOrderByRecordTimeDesc(
            Employee employee,
            LocalDate today
    );

    List<TimeRecord>
    findByEmployeeAndRecordDateOrderByRecordTimeAsc(
            Employee employee,
            LocalDate today
    );

//    List<TimeRecord> findPendingManualRecords();

//    List<TimeRecord> findApprovedRecords();

//    List<TimeRecord> findByRecordTimeBetween(LocalDateTime recordTimeAfter, LocalDateTime recordTimeBefore);
}
