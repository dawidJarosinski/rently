package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.PropertyRequest;
import com.rently.rentlybackend.dto.response.PropertyResponse;
import com.rently.rentlybackend.exception.PropertyException;
import com.rently.rentlybackend.mapper.AddressMapper;
import com.rently.rentlybackend.mapper.PropertyMapper;
import com.rently.rentlybackend.model.Address;
import com.rently.rentlybackend.model.Property;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.PropertyRepository;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;
    private final AddressMapper addressMapper;

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

        return propertyMapper.toDto(property, addressMapper.toDto(address));
    }

    public PropertyResponse findById(UUID id) {
        Property property = propertyRepository.findPropertyById(id)
                .orElseThrow(() -> new PropertyException("wrong property id"));
        return propertyMapper.toDto(property, addressMapper.toDto(property.getAddress()));
    }

    public List<PropertyResponse> findAllByOwnerId(UUID id) {
        return propertyRepository.findPropertiesByUser_Id(id)
                .stream()
                .map(property -> propertyMapper.toDto(property, addressMapper.toDto(property.getAddress())))
                .toList();
    }

    @Transactional
    public PropertyResponse approve(UUID id) {
        Property property = propertyRepository.findPropertyById(id)
                .orElseThrow(() -> new PropertyException("wrong property id"));
        property.setApproved(true);

        property = propertyRepository.save(property);

        return propertyMapper.toDto(property, addressMapper.toDto(property.getAddress()));
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
                .map(property -> propertyMapper.toDto(property, addressMapper.toDto(property.getAddress())))
                .toList();
    }

    public List<PropertyResponse> findAllApprovedOrderByAvgRatingDesc(Integer limit) {
        return propertyRepository.findAllApprovedOrderByAvgRatingDesc()
                .stream()
                .map(property -> propertyMapper.toDto(property, addressMapper.toDto(property.getAddress())))
                .limit(limit)
                .toList();
    }
}
