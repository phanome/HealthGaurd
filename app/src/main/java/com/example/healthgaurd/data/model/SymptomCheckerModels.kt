package com.example.healthgaurd.data.model

data class SymptomCheckRequest(
    val message: String
)

data class SymptomCheckResponse(
    val response: SymptomAnalysis?
)

data class SymptomAnalysis(
    val conditions: List<Condition>?,
    val tests: List<MedicalTest>?,
    val remedies: List<Remedy>?,
    val doctor: DoctorAdvice?,
    val disclaimer: String?
)

data class Condition(
    val name: String?,
    val probability: String?,
    val reason: String?
)

data class MedicalTest(
    val name: String?,
    val reason: String?
)

data class Remedy(
    val name: String?,
    val description: String?
)

data class DoctorAdvice(
    val when_to_visit: String?
)
