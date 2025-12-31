package com.example.healthgaurd.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

// Colors based on frontend
val Teal600 = Color(0xFF0D9488)
val Emerald800 = Color(0xFF065F46)
val Indigo600 = Color(0xFF4F46E5)

@Composable
fun HomeScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        // Hero Section
        Card(
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(Teal600, Emerald800)
                        )
                    )
                    .padding(24.dp)
            ) {
                Column {
                    Text(
                        text = "Advanced Health Intelligence",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Your personal AI health companion. Predict potential conditions and optimize your lifestyle with precision data.",
                        style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFFCCFBF1))
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Button(
                            onClick = { navController.navigate("syc") },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(50)
                        ) {
                            Text(text = "Check Symptoms", color = Teal600)
                        }
                    }
                }
            }
        }

        // Features Section
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Symptom Checker Card
            Card(
                modifier = Modifier
                    .weight(1f)
                    .clickable { navController.navigate("syc") },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "AI Symptom Checker", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Chat with our intelligent bot regarding your symptoms.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(text = "Start Assessment ->", color = Teal600, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Lifestyle Enhancer Card
            Card(
                modifier = Modifier
                    .weight(1f)
                    .clickable { navController.navigate("lifestyle") },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Lifestyle Enhancer", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Upload health data and receive a personalized wellness plan.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(text = "View Dashboard ->", color = Indigo600, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        // Trust Section
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🛡️ Secure Health Data", fontWeight = FontWeight.SemiBold)
                }
                Text(text = "Your information is safe & encrypted.", fontSize = 12.sp, color = Color.Gray)
                
                Spacer(modifier = Modifier.height(12.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "❤️ Holistic Care", fontWeight = FontWeight.SemiBold)
                }
                Text(text = "Genetics, lifestyle & environment included.", fontSize = 12.sp, color = Color.Gray)
            }
        }
    }
}
