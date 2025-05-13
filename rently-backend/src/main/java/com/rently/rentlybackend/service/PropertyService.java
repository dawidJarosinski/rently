package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.exception.PropertyException;
import com.rently.rentlybackend.mapper.AddressMapper;
import com.rently.rentlybackend.mapper.PropertyMapper;
import com.rently.rentlybackend.model.Address;
import com.rently.rentlybackend.model.Booking;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.BookingRepository;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.RatingRepository;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;
    private final AddressMapper addressMapper;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;
    private final GoogleDriveUploaderService googleDriveUploaderService;

    public List<PropertyResponse> findAll(String location, LocalDate checkIn, LocalDate checkOut, Integer guestCount) {
        List<Property> properties = propertyRepository.findAll().stream()
                .filter(property -> location == null || matchesLocation(property, location))
                .filter(property -> guestCount == null || property.getMaxNumberOfGuests() >= guestCount)
                .filter(property -> isAvailable(property, checkIn, checkOut))
                .toList();
        return properties.stream()
                .map(property -> propertyMapper.toDto(
                        property,
                        ratingRepository.countAverageRateByProperty(property),
                        addressMapper.toDto(property.getAddress()),
                        convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))))
                .toList();
    }

    @Transactional
    public PropertyResponse save(PropertyRequest request, String currentUserUsername) {
        User user = userRepository.findUserByEmail(currentUserUsername)
                .orElseThrow(() -> new UsernameNotFoundException("wrong user"));

        Property property = propertyMapper.fromDto(request);
        Address address = addressMapper.fromDto(request.address());

        property.setApproved(false);
        property.setUser(user);
        address.setProperty(property);
        property.setAddress(address);

        propertyRepository.save(property);

        return propertyMapper.toDto(
                property,
                ratingRepository.countAverageRateByProperty(property),
                addressMapper.toDto(property.getAddress()),
                convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
        );
    }

    public PropertyResponse findById(UUID id) {
        Property property = propertyRepository.findPropertyById(id)
                .orElseThrow(() -> new PropertyException("wrong property id"));
        return propertyMapper.toDto(
                property,
                ratingRepository.countAverageRateByProperty(property),
                addressMapper.toDto(property.getAddress()),
                convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
        );
    }

    public List<PropertyResponse> findAllByOwnerId(UUID id) {
        return propertyRepository.findPropertiesByUser_Id(id)
                .stream()
                .map(property -> propertyMapper.toDto(
                        property,
                        ratingRepository.countAverageRateByProperty(property),
                        addressMapper.toDto(property.getAddress()),
                        convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
                ))
                .toList();
    }

    @Transactional
    public PropertyResponse approve(UUID id) {
        Property property = propertyRepository.findPropertyById(id)
                .orElseThrow(() -> new PropertyException("wrong property id"));
        property.setApproved(true);

        property = propertyRepository.save(property);

        return propertyMapper.toDto(
                property,
                ratingRepository.countAverageRateByProperty(property),
                addressMapper.toDto(property.getAddress()),
                convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
        );
    }

    @Transactional
    public void decline(UUID id) {
        Property property = propertyRepository.findPropertyById(id)
                .orElseThrow(() -> new PropertyException("wrong property id"));

        propertyRepository.delete(property);
    }

    public List<PropertyResponse> findPropertiesByApprove(boolean approve) {
        return propertyRepository.findAll()
                .stream()
                .filter(property -> property.isApproved() == approve)
                .map(property -> propertyMapper.toDto(
                        property,
                        ratingRepository.countAverageRateByProperty(property),
                        addressMapper.toDto(property.getAddress()),
                        convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
                ))
                .toList();
    }

    public List<PropertyResponse> findAllApprovedOrderByAvgRatingDesc(Integer limit) {
        return propertyRepository.findAllApprovedOrderByAvgRatingDesc()
                .stream()
                .map(property -> propertyMapper.toDto(
                        property,
                        ratingRepository.countAverageRateByProperty(property),
                        addressMapper.toDto(property.getAddress()),
                        convertImagesIdsToImageUrls(googleDriveUploaderService.findPhotosIdByPropertyId(property.getId()))
                ))
                .limit(limit)
                .toList();
    }

    private boolean isAvailable(Property property, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) return true;
        return !bookingRepository.existsBookingCollisionInDatesAndProperty(checkIn, checkOut, property);
    }

    private boolean matchesLocation(Property p, String location) {
        String loc = location.toLowerCase();
        return p.getAddress().getCity().toLowerCase().contains(loc) ||
                p.getAddress().getCountry().toLowerCase().contains(loc);
    }

    private List<String> convertImagesIdsToImageUrls(List<String> images) {
        return images.stream().map(image -> "/api/properties/images/" + image).toList();
    }
}
