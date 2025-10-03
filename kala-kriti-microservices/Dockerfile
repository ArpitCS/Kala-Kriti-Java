# Create Dockerfile in your backend root
FROM maven:3.9.6-eclipse-temurin-21 AS builder
COPY . /build
WORKDIR /build
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
