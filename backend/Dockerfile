# Build stage - Updated 2026-02-07 22:15 - CORS FIX
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy and build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run with production profile
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
