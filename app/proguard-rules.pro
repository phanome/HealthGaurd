# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/anurag/Library/Android/sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-dontwarn okio.**
-dontwarn javax.annotation.**

# Gson
-keepattributes EnclosingMethod
-keepattributes InnerClasses
-keep class com.example.healthgaurd.data.model.** { *; }
