package com.buytheway.modules.user.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.buytheway.common.response.ApiResponse;
import com.buytheway.modules.user.dto.UserDTO;
import com.buytheway.modules.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
		UserDTO created = userService.createUser(userDTO);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>("User created successfully", created));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
		return ResponseEntity.ok(new ApiResponse<>("Users fetched successfully", userService.getAllUsers()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponse<>("User fetched successfully", userService.getUserById(id)));
	}

	@GetMapping("/by-email")
	public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@RequestParam String email) {
		return ResponseEntity.ok(new ApiResponse<>("User fetched successfully", userService.getUserByEmail(email)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDTO>> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
		return ResponseEntity.ok(new ApiResponse<>("User updated successfully", userService.updateUser(id, userDTO)));
	}

	@PatchMapping("/{id}/active")
	public ResponseEntity<ApiResponse<UserDTO>> setUserActiveStatus(@PathVariable Long id, @RequestParam boolean active) {
		return ResponseEntity.ok(new ApiResponse<>("User status updated successfully", userService.setUserActiveStatus(id, active)));
	}

	@GetMapping("/{id}/validate-checkout")
	public ResponseEntity<ApiResponse<Map<String, Object>>> validateUserForCheckout(@PathVariable Long id) {
		boolean valid = userService.validateUserForCheckout(id);
		return ResponseEntity.ok(new ApiResponse<>("User checkout validation completed", Map.of("userId", id, "valid", valid)));
	}
}
