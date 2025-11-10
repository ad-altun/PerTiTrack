FROM eclipse-temurin:21-jre-alpine
EXPOSE 8080
ADD backend/target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]