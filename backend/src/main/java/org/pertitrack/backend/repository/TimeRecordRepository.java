package org.pertitrack.backend.repository;

import org.pertitrack.backend.entity.timetrack.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import java.util.*;

@Repository
public interface TimeRecordRepository extends JpaRepository<TimeRecord, String> {

    List<TimeRecord> findByEmployeeId(String employeeId);

//    List<TimeRecord> findPendingManualRecords();

//    List<TimeRecord> findApprovedRecords();

//    List<TimeRecord> findByRecordTimeBetween(LocalDateTime recordTimeAfter, LocalDateTime recordTimeBefore);
}
