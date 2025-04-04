package com.rently.rentlybackend.mapper;

import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.enums.PropertyType;
import com.rently.rentlybackend.model.Property;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public Property fromDto(PropertyRequest propertyRequest) {
        return new Property(
                propertyRequest.name(),
                propertyRequest.description(),
                propertyRequest.maxNumberOfGuests(),
                propertyRequest.pricePerNight(),
                PropertyType.valueOf(propertyRequest.propertyType())
        );
    }

    public PropertyResponse toDto(Property property, PropertyResponse.Address addressResponse) {
        return new PropertyResponse(
                property.getId().toString(),
                property.getUser().getId().toString(),
                property.getPropertyType().toString(),
                property.getName(),
                property.getDescription(),
                property.getMaxNumberOfGuests(),
                property.getPricePerNight(),
                property.isApproved(),
                addressResponse
        );
    }
}
