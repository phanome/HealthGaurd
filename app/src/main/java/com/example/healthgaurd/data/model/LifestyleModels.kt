package com.example.healthgaurd.data.model

data class LifestyleRequest(
    val inputData: LifestyleData
)

data class LifestyleData(
    // CBC
    val blood_hemoglobin: String = "",
    val blood_wbc: String = "",
    val blood_platelets: String = "",

    // Sugar
    val blood_fbs: String = "",
    val blood_ppbs: String = "",
    val blood_rbs: String = "",
    val blood_hba1c: String = "",

    // Lipid
    val lipid_cholesterol: String = "",
    val lipid_hdl: String = "",
    val lipid_ldl: String = "",
    val lipid_triglycerides: String = "",

    // Env
    val env_aqi: String = "",
    val env_water_tds: String = "",
    val env_uv_index: String = "",
    val calories_intake_avg: String = "",
    val calories_burn_avg: String = "",

    // Family
    val family_history: String = ""
)

data class LifestyleResponse(
    val report: String?
)
