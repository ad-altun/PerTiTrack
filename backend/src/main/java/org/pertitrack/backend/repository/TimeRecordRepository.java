package org.pertitrack.backend.repository;

import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeRecordRepository extends JpaRepository<TimeRecord, String> {

    List<TimeRecord> findByEmployeeId(String employeeId);

//    List<TimeRecord> findPendingManualRecords();

//    List<TimeRecord> findApprovedRecords();

//    List<TimeRecord> findByRecordTimeBetween(LocalDateTime recordTimeAfter, LocalDateTime recordTimeBefore);
}
