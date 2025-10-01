package org.pertitrack.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // This test verifies that the Spring application context loads successfully.
        // No assertions are needed as the test will fail if the context cannot be created.
    }

}
