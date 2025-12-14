import requests
import json

BASE_URL = "http://127.0.0.1:5000"

# --------------------------
# SAFE JSON PARSE
# --------------------------
def safe_json(response):
    try:
        return response.json()
    except:
        print("\n❌ Server did NOT return JSON.")
        print("RAW RESPONSE ↓↓↓\n")
        print(response.text)
        return None

# -----------------------------------------------------------
# 1️⃣ Test Symptom Checker API
# -----------------------------------------------------------
def test_symptom_checker():
    print("\n=== 🧪 Testing Symptom Checker API ===")

    user_message = input("\nEnter symptom prompt: ")

    payload = {
        "message": user_message,
        "history": []
    }

    print("\n⏳ Sending request...\n")

    try:
        response = requests.post(f"{BASE_URL}/symptom-checker", json=payload, timeout=20)
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Server did not respond.")
        return
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return

    data = safe_json(response)
    if not data:
        return

    print("\n--- CLEAN OUTPUT ---\n")

    # If backend returned wrapped response
    if "response" in data:
        result = data["response"]

        if isinstance(result, dict):
            print(json.dumps(result, indent=2))
        else:
            print(result)
    else:
        print(json.dumps(data, indent=2))

# -----------------------------------------------------------
# 2️⃣ Test Lifestyle Enhancer API
# -----------------------------------------------------------
def test_lifestyle_enhancer():
    print("\n=== 🧪 Testing Lifestyle Enhancer API ===")

    payload = {
        "inputData": {
            "blood_fbs": 120,
            "lipid_cholesterol": 240,
            "heart_bmi": 27.8,
            "heart_bp_systolic": 130,
            "heart_bp_diastolic": 89,
            "env_aqi": 160,
            "env_water_tds": 350,
            "env_uv_index": 9,
            "family_history": "diabetes & hypertension"
        }
    }

    print("\n⏳ Sending request...\n")

    try:
        response = requests.post(f"{BASE_URL}/lifestyle-enhancer", json=payload, timeout=20)
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return

    data = safe_json(response)
    if not data:
        return

    print("\n--- CLEAN OUTPUT ---\n")
    print(json.dumps(data, indent=2))

# -----------------------------------------------------------
# MAIN MENU
# -----------------------------------------------------------
def main():
    while True:
        print("\n======================================")
        print("     HEALTH GUARD AI TEST TOOL")
        print("======================================")
        print("1. Test Symptom Checker API")
        print("2. Test Lifestyle Enhancer API")
        print("3. Exit")

        choice = input("\nChoose an option: ")

        if choice == "1":
            test_symptom_checker()
        elif choice == "2":
            test_lifestyle_enhancer()
        else:
            print("\n👋 Exiting test tool...\n")
            break

if __name__ == "__main__":
    main()
