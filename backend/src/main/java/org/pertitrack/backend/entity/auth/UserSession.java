package org.pertitrack.backend.entity.auth;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;
import org.pertitrack.backend.entity.*;

import java.time.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_sessions", schema = "app_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSession  extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "refresh_token", unique = true, nullable = false)
    @NotBlank
    private String refreshToken;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
