package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.exception.PropertyException;
import com.rently.rentlybackend.mapper.AddressMapper;
import com.rently.rentlybackend.mapper.PropertyMapper;
import com.rently.rentlybackend.model.Address;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.BookingRepository;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.RatingRepository;
import com.rently.rentlybackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock private PropertyRepository propertyRepository;
    @Mock private UserRepository userRepository;
    @Mock private PropertyMapper propertyMapper;
    @Mock private AddressMapper addressMapper;
    @Mock private BookingRepository bookingRepository;
    @Mock private RatingRepository ratingRepository;
    @Mock private GoogleDriveUploaderService googleDriveUploaderService;

    @InjectMocks
    private PropertyService propertyService;

    @Test
    void save_shouldPersistPropertyAndReturnResponse() {
        // given
        String userEmail = "user@example.com";
        User user = new User();
        PropertyRequest.Address addressDto = new PropertyRequest.Address("Poland", "Warsaw", "Main", "1", null, "00-000");
        PropertyRequest request = new PropertyRequest("House", "Nice House", "Desc", 4, new BigDecimal("200"), addressDto);

        Property property = new Property();
        Address address = new Address();
        PropertyResponse expectedResponse = mock(PropertyResponse.class);

        when(userRepository.findUserByEmail(userEmail)).thenReturn(Optional.of(user));
        when(propertyMapper.fromDto(request)).thenReturn(property);
        when(addressMapper.fromDto(addressDto)).thenReturn(address);
        when(propertyMapper.toDto(any(), anyDouble(), any(), any())).thenReturn(expectedResponse);
        // when
        PropertyResponse response = propertyService.save(request, userEmail);

        // then
        assertEquals(expectedResponse, response);
        verify(propertyRepository).save(property);
        verify(addressMapper).fromDto(addressDto);
    }

    @Test
    void findById_shouldReturnPropertyResponse() {
        UUID propertyId = UUID.randomUUID();
        Property property = mock(Property.class);
        Address address = mock(Address.class);
        PropertyResponse expected = mock(PropertyResponse.class);

        when(propertyRepository.findPropertyById(propertyId)).thenReturn(Optional.of(property));
        when(property.getAddress()).thenReturn(address);
        when(propertyMapper.toDto(eq(property), any(), any(), any())).thenReturn(expected);
        when(googleDriveUploaderService.findPhotosIdByPropertyId(any())).thenReturn(List.of("img1"));

        PropertyResponse result = propertyService.findById(propertyId);

        assertEquals(expected, result);
    }

    @Test
    void approve_shouldMarkPropertyAsApproved() {
        UUID propertyId = UUID.randomUUID();
        Property property = new Property();
        property.setApproved(false);

        when(propertyRepository.findPropertyById(propertyId)).thenReturn(Optional.of(property));
        when(propertyRepository.save(property)).thenReturn(property);
        when(propertyMapper.toDto(eq(property), any(), any(), any())).thenReturn(mock(PropertyResponse.class));

        PropertyResponse result = propertyService.approve(propertyId);

        assertTrue(property.isApproved());
        verify(propertyRepository).save(property);
    }

    @Test
    void decline_shouldDeleteProperty() {
        UUID propertyId = UUID.randomUUID();
        Property property = new Property();

        when(propertyRepository.findPropertyById(propertyId)).thenReturn(Optional.of(property));

        propertyService.decline(propertyId);

        verify(propertyRepository).delete(property);
    }

    @Test
    void findAll_shouldFilterAndReturnMatchingProperties() {
        Property property = mock(Property.class);
        when(propertyRepository.findAll()).thenReturn(List.of(property));
        lenient().when(property.getMaxNumberOfGuests()).thenReturn(4);
        lenient().when(property.getAddress()).thenReturn(new Address("PL", "City", "Street", "1", null, "00-000"));
        lenient().when(bookingRepository.existsBookingCollisionInDatesAndProperty(any(), any(), eq(property))).thenReturn(false);
        lenient().when(propertyMapper.toDto(eq(property), any(), any(), any())).thenReturn(mock(PropertyResponse.class));
        lenient().when(ratingRepository.countAverageRateByProperty(property)).thenReturn(4.0);
        lenient().when(googleDriveUploaderService.findPhotosIdByPropertyId(any())).thenReturn(List.of("img1"));

        List<PropertyResponse> results = propertyService.findAll("City", null, null, 2);

        assertEquals(1, results.size());
    }
}
