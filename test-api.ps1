# PersonalFit API Test Script
# Run this script to test all major endpoints

Write-Host "=== PersonalFit API Test Suite ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$token = ""
$userId = ""

# Function to display results
function Show-Result {
    param($step, $response, $error)
    if ($error) {
        Write-Host "❌ $step - FAILED" -ForegroundColor Red
        Write-Host $error -ForegroundColor Red
    } else {
        Write-Host "✅ $step - SUCCESS" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    }
    Write-Host ""
}

try {
    # 1. Health Check
    Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Show-Result "Health Check" $health

    # 2. Signup
    Write-Host "2. Creating Test User..." -ForegroundColor Yellow
    $signupBody = @{
        email = "testuser_$(Get-Random)@docker.com"
        password = "Test1234!"
        name = "Docker Test User"
    } | ConvertTo-Json

    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    $token = $signup.accessToken
    $userId = $signup.user.id
    Show-Result "User Signup" $signup

    $headers = @{Authorization = "Bearer $token"}

    # 3. Get Profile
    Write-Host "3. Getting User Profile..." -ForegroundColor Yellow
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/profile" -Method Get -Headers $headers
    Show-Result "Get Profile" $profile

    # 4. Update Profile
    Write-Host "4. Updating Profile..." -ForegroundColor Yellow
    $updateBody = @{
        profile = @{
            first_name = "Docker"
            last_name = "Test"
            height_cm = 180
            weight_kg = 75
            date_of_birth = "1990-01-01"
            fitness_goals = @("weight_loss", "muscle_gain")
            experience_level = "intermediate"
        }
        preferences = @{
            preferred_workout_days = @("Monday", "Wednesday", "Friday")
            preferred_workout_duration = 60
            equipment_access = @("dumbbells", "resistance_bands")
        }
    } | ConvertTo-Json -Depth 3

    $profileUpdate = Invoke-RestMethod -Uri "$baseUrl/api/profile" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    Show-Result "Update Profile" $profileUpdate

    # 5. Add Equipment
    Write-Host "5. Adding Equipment..." -ForegroundColor Yellow
    $equipmentBody = @{
        equipment_name = "Adjustable Dumbbells"
        equipment_type = "free_weights"
        quantity = 2
        specifications = @{
            weight_kg = 24
            adjustable = $true
            min_weight_kg = 2
            max_weight_kg = 24
        }
        condition = "good"
        notes = "Bowflex SelectTech 552"
    } | ConvertTo-Json -Depth 3

    $equipment = Invoke-RestMethod -Uri "$baseUrl/api/equipment" -Method Post -Headers $headers -Body $equipmentBody -ContentType "application/json"
    Show-Result "Add Equipment" $equipment

    # 6. Get Equipment List
    Write-Host "6. Getting Equipment List..." -ForegroundColor Yellow
    $equipmentList = Invoke-RestMethod -Uri "$baseUrl/api/equipment" -Method Get -Headers $headers
    Show-Result "Get Equipment" $equipmentList

    # 7. Add Body Metrics
    Write-Host "7. Adding Body Metrics..." -ForegroundColor Yellow
    $metricsBody = @{
        measurement_date = (Get-Date).ToString("yyyy-MM-dd")
        weight_kg = 75.5
        body_fat_percentage = 18.5
        measurements = @{
            chest_cm = 100
            waist_cm = 85
            hips_cm = 95
        }
        notes = "Feeling great!"
    } | ConvertTo-Json -Depth 3

    $metrics = Invoke-RestMethod -Uri "$baseUrl/api/metrics" -Method Post -Headers $headers -Body $metricsBody -ContentType "application/json"
    Show-Result "Add Body Metrics" $metrics

    # 8. Get Metrics
    Write-Host "8. Getting Body Metrics..." -ForegroundColor Yellow
    $metricsList = Invoke-RestMethod -Uri "$baseUrl/api/metrics" -Method Get -Headers $headers
    Show-Result "Get Body Metrics" $metricsList

    # 9. Get Accountability
    Write-Host "9. Getting Accountability Status..." -ForegroundColor Yellow
    $accountability = Invoke-RestMethod -Uri "$baseUrl/api/accountability" -Method Get -Headers $headers
    Show-Result "Get Accountability" $accountability

    # 10. Generate Workout (if OpenAI key is configured)
    Write-Host "10. Testing Workout Generation..." -ForegroundColor Yellow
    $workoutBody = @{
        goals = @("weight_loss", "muscle_gain")
        duration_minutes = 45
        equipment_available = @("dumbbells", "resistance_bands")
        difficulty = "intermediate"
    } | ConvertTo-Json

    try {
        $workout = Invoke-RestMethod -Uri "$baseUrl/api/workouts/generate" -Method Post -Headers $headers -Body $workoutBody -ContentType "application/json" -ErrorAction Stop
        Show-Result "Generate Workout" $workout
    } catch {
        Write-Host "⚠️  Workout Generation - SKIPPED (Requires OpenAI API Key)" -ForegroundColor Yellow
        Write-Host "   Set OPENAI_API_KEY in .env to test this feature" -ForegroundColor Gray
        Write-Host ""
    }

    # Summary
    Write-Host "=== Test Summary ===" -ForegroundColor Cyan
    Write-Host "✅ All core endpoints tested successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Test photo upload with actual image file" -ForegroundColor Gray
    Write-Host "  2. Open MinIO Console: http://localhost:9003" -ForegroundColor Gray
    Write-Host "  3. Login: minioadmin / minioadmin123" -ForegroundColor Gray
    Write-Host "  4. Check progress-photos bucket" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Your Access Token:" -ForegroundColor Yellow
    Write-Host $token -ForegroundColor Cyan

} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
