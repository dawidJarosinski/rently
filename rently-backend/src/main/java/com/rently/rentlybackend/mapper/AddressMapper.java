package com.rently.rentlybackend.mapper;


import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address fromDto(PropertyRequest.Address addressRequest) {
        return new Address(
                addressRequest.country(),
                addressRequest.city(),
                addressRequest.street(),
                addressRequest.houseNumber(),
                addressRequest.localNumber(),
                addressRequest.postalCode()
        );
    }

    public PropertyResponse.Address toDto(Address address) {
        return new PropertyResponse.Address(
                address.getCountry(),
                address.getCity(),
                address.getStreet(),
                address.getHouseNumber(),
                address.getLocalNumber(),
                address.getPostalCode()
        );
    }
}
