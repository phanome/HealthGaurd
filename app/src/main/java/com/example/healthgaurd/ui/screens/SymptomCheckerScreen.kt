package com.example.healthgaurd.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.healthgaurd.data.model.SymptomCheckRequest
import com.example.healthgaurd.data.model.SymptomAnalysis
import com.example.healthgaurd.data.remote.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun SymptomCheckerScreen(navController: NavController) {
    var input by remember { mutableStateOf("") }
    var structured by remember { mutableStateOf<SymptomAnalysis?>(null) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    
    val scope = rememberCoroutineScope()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Symptom Checker", style = MaterialTheme.typography.headlineMedium)
        
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = input,
            onValueChange = { input = it },
            label = { Text("Describe your symptoms...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp),
            maxLines = 5
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (input.isNotBlank()) {
                    loading = true
                    error = ""
                    structured = null
                    scope.launch {
                        try {
                            val response = RetrofitClient.instance.checkSymptoms(SymptomCheckRequest(input))
                            if (response.isSuccessful && response.body()?.response != null) {
                                structured = response.body()?.response
                            } else {
                                error = "Failed to analyze symptoms."
                            }
                        } catch (e: Exception) {
                            error = "Error: ${e.message}"
                        } finally {
                            loading = false
                        }
                    }
                }
            },
            enabled = !loading,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(if (loading) "Analyzing..." else "Check Symptoms")
        }

        if (error.isNotEmpty()) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(error, color = Color.Red)
        }

        structured?.let { result ->
            Spacer(modifier = Modifier.height(24.dp))
            SymptomResultView(result)
        }
    }
}

@Composable
fun SymptomResultView(data: SymptomAnalysis) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        
        // Conditions
        Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(4.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Possible Conditions", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                if (data.conditions.isNullOrEmpty()) {
                    Text("No conditions predicted.", color = Color.Gray)
                } else {
                    data.conditions.forEach { condition ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(condition.name ?: "Unknown", fontWeight = FontWeight.SemiBold)
                            Text(condition.probability ?: "", color = Color.Gray)
                        }
                    }
                }
            }
        }

        // Tests
        Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(4.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Recommended Tests", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                if (data.tests.isNullOrEmpty()) {
                    Text("No tests recommended.", color = Color.Gray)
                } else {
                    data.tests.forEach { test ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("• ${test.name}: ${test.reason ?: ""}")
                    }
                }
            }
        }

        // Remedies
        Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(4.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Home Remedies", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                if (data.remedies.isNullOrEmpty()) {
                    Text("No remedies available.", color = Color.Gray)
                } else {
                    data.remedies.forEach { remedy ->
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("• ${remedy.name}: ${remedy.description ?: ""}")
                    }
                }
            }
        }
        
        // Doctor
        Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(4.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("When to See a Doctor", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text(data.doctor?.when_to_visit ?: "No specific advice.", color = Color.Black)
            }
        }

        // Disclaimer
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF9C4)), // Yellowish
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Disclaimer", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFFF57F17))
                Text(data.disclaimer ?: "", color = Color.Black)
            }
        }
    }
}
