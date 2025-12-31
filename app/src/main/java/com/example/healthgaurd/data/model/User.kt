package com.example.healthgaurd.data.model

data class User(
    val id: String,
    val first_name: String,
    val last_name: String,
    val email: String,
    val role: String? = "user"
)
