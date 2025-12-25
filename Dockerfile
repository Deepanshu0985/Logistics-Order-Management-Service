# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test --no-daemon

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Environment variables with defaults
ENV PORT=8080
ENV JWT_SECRET=dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9yand0dG9rZW5nZW5lcmF0aW9uYW5kc2hvdWxkYmVhdGxlYXN0MjU2Yml0cw==
ENV JWT_EXPIRATION=86400000

EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
