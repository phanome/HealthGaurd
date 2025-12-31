package com.example.healthgaurd.data.remote

import com.example.healthgaurd.data.model.AuthResponse
import com.example.healthgaurd.data.model.LifestyleRequest
import com.example.healthgaurd.data.model.LifestyleResponse
import com.example.healthgaurd.data.model.LoginRequest
import com.example.healthgaurd.data.model.SignupRequest
import com.example.healthgaurd.data.model.SymptomCheckRequest
import com.example.healthgaurd.data.model.SymptomCheckResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/signup")
    suspend fun signup(@Body request: SignupRequest): Response<AuthResponse>

    @GET("api/auth/me")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<AuthResponse>

    @POST("api/ai/symptom-checker")
    suspend fun checkSymptoms(@Body request: SymptomCheckRequest): Response<SymptomCheckResponse>

    @POST("api/ai/lifestyle-enhancer")
    suspend fun generateLifestylePlan(@Body request: LifestyleRequest): Response<LifestyleResponse>
}
