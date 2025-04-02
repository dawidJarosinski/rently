package com.rently.rentlybackend.service;

import com.rently.rentlybackend.dto.request.LoginRequest;
import com.rently.rentlybackend.dto.request.RegisterRequest;
import com.rently.rentlybackend.dto.response.RegisterResponse;
import com.rently.rentlybackend.dto.response.TokenResponse;
import com.rently.rentlybackend.enums.Role;
import com.rently.rentlybackend.model.User;
import com.rently.rentlybackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findUserByEmail(request.email()).orElseThrow(() -> new UsernameNotFoundException("wrong username"));
        return new TokenResponse(jwtService.generateToken(user));
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsUserByEmail(request.email())) {
            throw new IllegalArgumentException("user with this email already exists");
        }
        if(!request.role().equals(Role.HOST.name()) && !request.role().equals(Role.USER.name())) {
            throw new IllegalArgumentException("wrong role");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName(),
                Role.valueOf(request.role())
        );

        userRepository.save(user);

        return new RegisterResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name());
    }
}
