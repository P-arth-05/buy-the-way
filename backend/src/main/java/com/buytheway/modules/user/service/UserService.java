package com.buytheway.modules.user.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.buytheway.modules.user.dto.UserDTO;
import com.buytheway.modules.user.entity.User;
import com.buytheway.modules.user.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserDTO createUser(UserDTO dto) {
		if (userRepository.existsByEmailIgnoreCase(dto.getEmail())) {
			throw new RuntimeException("User with this email already exists");
		}
		User user = mapToEntity(dto);
		user.setId(null);
		user.setActive(dto.getActive() == null || dto.getActive());
		return mapToDTO(userRepository.save(user));
	}

	public List<UserDTO> getAllUsers() {
		return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public UserDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		return mapToDTO(user);
	}

	public UserDTO getUserByEmail(String email) {
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
		return mapToDTO(user);
	}

	public UserDTO updateUser(Long id, UserDTO dto) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));

		userRepository.findByEmailIgnoreCase(dto.getEmail()).ifPresent(found -> {
			if (!found.getId().equals(id)) {
				throw new RuntimeException("Email is already used by another user");
			}
		});

		existingUser.setName(dto.getName());
		existingUser.setEmail(dto.getEmail());
		existingUser.setPhone(dto.getPhone());
		existingUser.setAddress(dto.getAddress());
		existingUser.setCity(dto.getCity());
		existingUser.setState(dto.getState());
		existingUser.setPincode(dto.getPincode());
		if (dto.getActive() != null) {
			existingUser.setActive(dto.getActive());
		}

		return mapToDTO(userRepository.save(existingUser));
	}

	public UserDTO setUserActiveStatus(Long id, boolean active) {
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
		existingUser.setActive(active);
		return mapToDTO(userRepository.save(existingUser));
	}

	public boolean validateUserForCheckout(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));

		return Boolean.TRUE.equals(user.getActive())
				&& notBlank(user.getName())
				&& notBlank(user.getEmail())
				&& notBlank(user.getPhone())
				&& notBlank(user.getAddress())
				&& notBlank(user.getCity())
				&& notBlank(user.getState())
				&& notBlank(user.getPincode());
	}

	private boolean notBlank(String value) {
		return value != null && !value.trim().isEmpty();
	}

	private UserDTO mapToDTO(User user) {
		UserDTO dto = new UserDTO();
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setPhone(user.getPhone());
		dto.setAddress(user.getAddress());
		dto.setCity(user.getCity());
		dto.setState(user.getState());
		dto.setPincode(user.getPincode());
		dto.setActive(user.getActive());
		return dto;
	}

	private User mapToEntity(UserDTO dto) {
		User user = new User();
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setPhone(dto.getPhone());
		user.setAddress(dto.getAddress());
		user.setCity(dto.getCity());
		user.setState(dto.getState());
		user.setPincode(dto.getPincode());
		user.setActive(dto.getActive());
		return user;
	}
}
