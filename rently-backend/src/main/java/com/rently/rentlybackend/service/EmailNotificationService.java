package com.rently.rentlybackend.service;

import com.rently.rentlybackend.config.RabbitConfig;
import com.rently.rentlybackend.exchange.BookingExchange;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final MailSernderService mailSernderService;

    @RabbitListener(queues = "BookingQueue")
    public void handleBookingEvent(BookingExchange bookingExchange) {
        mailSernderService.sendMail(
                bookingExchange.email(),
                "Reservation " + bookingExchange.bookingId(),
                "Thanks " + bookingExchange.firstName() + " for reservation, final price: " + bookingExchange.finalPrice()
        );
    }
}
