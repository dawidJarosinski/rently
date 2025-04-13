package com.rently.rentlybackend.rest;


import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/host")
@CrossOrigin("*")
@RequiredArgsConstructor
public class HostBookingController {

    private final BookingService bookingService;

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> findAll(
            @RequestParam(required = false) UUID propertyId,
            Principal principal
    ) {
        return ResponseEntity.ok(bookingService.findAllByHost(principal.getName(), propertyId));
    }

}
