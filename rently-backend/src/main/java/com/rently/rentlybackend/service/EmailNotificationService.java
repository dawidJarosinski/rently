package com.rently.rentlybackend.service;

import com.rently.rentlybackend.event.BookingEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final MailSernderService mailSernderService;

    @KafkaListener(topics = "booking", groupId = "booking-group")
    public void handleBookingEvent(BookingEvent bookingEvent) {
        mailSernderService.sendMail(
                bookingEvent.email(),
                "Reservation " + bookingEvent.bookingId(),
                "Thanks " + bookingEvent.firstName() + " for reservation, final price: " + bookingEvent.finalPrice()
        );
    }
}
