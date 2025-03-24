package com.rently.rentlybackend.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {


    @GetMapping("/test")
    public String testHello() {
        return "hello";
    }

    @GetMapping("/securedtest")
    public String testSecuredHello() {
        return "secured hello";
    }

}
