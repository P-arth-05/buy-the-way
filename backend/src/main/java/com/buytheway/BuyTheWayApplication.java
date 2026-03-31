package com.buytheway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BuyTheWayApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuyTheWayApplication.class, args);
        System.out.println("🚀 BuyTheWay Backend is running...");
    }
}