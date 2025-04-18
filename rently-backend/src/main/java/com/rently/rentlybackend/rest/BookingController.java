package com.rently.rentlybackend.rest;

import com.rently.rentlybackend.dto.request.BookingRequest;
import com.rently.rentlybackend.dto.response.BookingResponse;
import com.rently.rentlybackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/properties/{id}/bookings")
    public ResponseEntity<BookingResponse> save(
            @RequestBody BookingRequest request,
            Principal principal,
            @PathVariable("id") UUID propertyId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.save(request, propertyId, principal.getName()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> findAllByUserId(
            Principal principal
    ) {
        return ResponseEntity.ok(bookingService.findAllByUser(principal.getName()));
    }

    @DeleteMapping("/bookings/{id}")
    public void delete(@PathVariable UUID id, Principal principal) {
        bookingService.delete(principal.getName(), id);
    }

}
