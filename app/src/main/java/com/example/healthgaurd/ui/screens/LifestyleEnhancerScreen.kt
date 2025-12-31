package com.example.healthgaurd.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.healthgaurd.data.model.LifestyleData
import com.example.healthgaurd.data.model.LifestyleRequest
import com.example.healthgaurd.data.remote.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun LifestyleEnhancerScreen(navController: NavController) {
    var step by remember { mutableIntStateOf(1) }
    var loading by remember { mutableStateOf(false) }
    var report by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    // Form Data State
    var bloodHemoglobin by remember { mutableStateOf("") }
    var bloodWbc by remember { mutableStateOf("") }
    var bloodPlatelets by remember { mutableStateOf("") }
    var bloodFbs by remember { mutableStateOf("") }
    var bloodPpbs by remember { mutableStateOf("") }
    var bloodRbs by remember { mutableStateOf("") }
    var bloodHba1c by remember { mutableStateOf("") }
    var lipidCholesterol by remember { mutableStateOf("") }
    var lipidHdl by remember { mutableStateOf("") }
    var lipidLdl by remember { mutableStateOf("") }
    var lipidTriglycerides by remember { mutableStateOf("") }
    var envAqi by remember { mutableStateOf("") }
    var envWaterTds by remember { mutableStateOf("") }
    var envUvIndex by remember { mutableStateOf("") }
    var caloriesIntake by remember { mutableStateOf("") }
    var caloriesBurn by remember { mutableStateOf("") }
    var familyHistory by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        if (step < 6) {
            Text("Step $step / 5", style = MaterialTheme.typography.labelLarge)
            LinearProgressIndicator(
                progress = step / 5f,
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
            )
        }

        when (step) {
            1 -> {
                Text("Blood Profile (CBC)", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(value = bloodHemoglobin, onValueChange = { bloodHemoglobin = it }, label = { Text("Hemoglobin (g/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = bloodWbc, onValueChange = { bloodWbc = it }, label = { Text("WBC Count (/µL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = bloodPlatelets, onValueChange = { bloodPlatelets = it }, label = { Text("Platelets (10³/µL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
            }
            2 -> {
                Text("Sugar Profile", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(value = bloodFbs, onValueChange = { bloodFbs = it }, label = { Text("Fasting Blood Sugar (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = bloodPpbs, onValueChange = { bloodPpbs = it }, label = { Text("Post-Prandial Sugar (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = bloodRbs, onValueChange = { bloodRbs = it }, label = { Text("Random Blood Sugar (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = bloodHba1c, onValueChange = { bloodHba1c = it }, label = { Text("HbA1c (%)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
            }
            3 -> {
                Text("Lipid Profile", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(value = lipidCholesterol, onValueChange = { lipidCholesterol = it }, label = { Text("Total Cholesterol (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = lipidHdl, onValueChange = { lipidHdl = it }, label = { Text("HDL (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = lipidLdl, onValueChange = { lipidLdl = it }, label = { Text("LDL (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = lipidTriglycerides, onValueChange = { lipidTriglycerides = it }, label = { Text("Triglycerides (mg/dL)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
            }
            4 -> {
                Text("Environment & Calories", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(value = envAqi, onValueChange = { envAqi = it }, label = { Text("Air Quality Index") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = envWaterTds, onValueChange = { envWaterTds = it }, label = { Text("Water TDS") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = envUvIndex, onValueChange = { envUvIndex = it }, label = { Text("UV Index") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = caloriesIntake, onValueChange = { caloriesIntake = it }, label = { Text("Calories Intake / Day") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = caloriesBurn, onValueChange = { caloriesBurn = it }, label = { Text("Calories Burn / Day") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
            }
            5 -> {
                Text("Family History", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = familyHistory,
                    onValueChange = { familyHistory = it },
                    label = { Text("Describe family history...") },
                    modifier = Modifier.fillMaxWidth().height(120.dp),
                    maxLines = 5
                )
            }
            6 -> {
                Text("Your Personalized Plan", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                Card(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = report,
                        modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
            if (step > 1 && step < 6) {
                OutlinedButton(onClick = { step-- }) { Text("Back") }
            } else {
                Spacer(modifier = Modifier.width(8.dp))
            }

            if (step < 5) {
                Button(onClick = { step++ }) { Text("Next") }
            } else if (step == 5) {
                Button(onClick = {
                    loading = true
                    scope.launch {
                        try {
                            val data = LifestyleData(
                                bloodHemoglobin, bloodWbc, bloodPlatelets,
                                bloodFbs, bloodPpbs, bloodRbs, bloodHba1c,
                                lipidCholesterol, lipidHdl, lipidLdl, lipidTriglycerides,
                                envAqi, envWaterTds, envUvIndex, caloriesIntake, caloriesBurn,
                                familyHistory
                            )
                            val response = RetrofitClient.instance.generateLifestylePlan(LifestyleRequest(data))
                            if (response.isSuccessful && response.body()?.report != null) {
                                report = response.body()?.report ?: "No report generated"
                                step = 6
                            }
                        } catch (e: Exception) {
                            // Handle error
                        } finally {
                            loading = false
                        }
                    }
                }, enabled = !loading) {
                    Text(if (loading) "Generating..." else "Generate Plan")
                }
            }
        }
    }
}
