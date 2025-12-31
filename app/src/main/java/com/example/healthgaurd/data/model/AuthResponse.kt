package com.example.healthgaurd.data.model

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val token: String?,
    val user: User?
)
