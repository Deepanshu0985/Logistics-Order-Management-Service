package com.logistics.ordermanagement.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

        @Value("${server.port:8080}")
        private String serverPort;

        @Bean
        public OpenAPI customOpenAPI() {
                final String securitySchemeName = "bearerAuth";

                return new OpenAPI()
                                .info(new Info()
                                                .title("Logistics Order Management API")
                                                .description("RESTful API for managing logistics orders and delivery partners. "
                                                                +
                                                                "Supports order lifecycle management, partner assignment, and real-time tracking.\n\n"
                                                                +
                                                                "**Authentication:** Use `/api/v1/auth/register` to create an account, "
                                                                +
                                                                "then `/api/v1/auth/login` to get a JWT token. Include the token in the "
                                                                +
                                                                "Authorization header as `Bearer <token>`.")
                                                .version("1.0.0")
                                                .contact(new Contact()
                                                                .name("Deepanshu Yadav")
                                                                .email("deepanshu@example.com"))
                                                .license(new License()
                                                                .name("MIT License")
                                                                .url("https://opensource.org/licenses/MIT")))
                                .servers(List.of(
                                                new Server()
                                                                .url("http://localhost:" + serverPort)
                                                                .description("Local Development Server")))
                                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                                .components(new Components()
                                                .addSecuritySchemes(securitySchemeName,
                                                                new SecurityScheme()
                                                                                .name(securitySchemeName)
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")
                                                                                .description("Enter JWT token (without 'Bearer ' prefix)")));
        }
}
