$baseUrl = "http://localhost:8080/api/employees"

Write-Host "Starting Employee API Tests..." -ForegroundColor Cyan

# 1. Test Create Employee
Write-Host "`n1. Testing Create Employee..." -ForegroundColor Yellow
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test.user@example.com"
    position = "Tester"
    department = "QA"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post -Uri $baseUrl -ContentType "application/json" -Body $body
    Write-Host "Success: Created Employee with ID $($response.id)" -ForegroundColor Green
    $createdId = $response.id
} catch {
    Write-Host "Failed to create employee: $_" -ForegroundColor Red
    exit 1
}

# 2. Test Get All Employees
Write-Host "`n2. Testing Get All Employees..." -ForegroundColor Yellow
try {
    $employees = Invoke-RestMethod -Method Get -Uri $baseUrl
    if ($employees.Count -gt 0) {
        Write-Host "Success: Retrieved $($employees.Count) employees" -ForegroundColor Green
    } else {
        Write-Host "Warning: No employees found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to get employees: $_" -ForegroundColor Red
}

# 3. Test Get Employee By ID
Write-Host "`n3. Testing Get Employee By ID ($createdId)..." -ForegroundColor Yellow
try {
    $employee = Invoke-RestMethod -Method Get -Uri "$baseUrl/$createdId"
    if ($employee.email -eq "test.user@example.com") {
        Write-Host "Success: Retrieved correct employee" -ForegroundColor Green
    } else {
        Write-Host "Failed: Employee data mismatch" -ForegroundColor Red
    }
} catch {
    Write-Host "Failed to get employee by ID: $_" -ForegroundColor Red
}

# 4. Test Update Employee
Write-Host "`n4. Testing Update Employee ($createdId)..." -ForegroundColor Yellow
$updateBody = @{
    firstName = "Updated"
    lastName = "User"
    email = "updated.user@example.com"
    position = "Senior Tester"
    department = "QA"
} | ConvertTo-Json

try {
    $updatedEmployee = Invoke-RestMethod -Method Put -Uri "$baseUrl/$createdId" -ContentType "application/json" -Body $updateBody
    if ($updatedEmployee.firstName -eq "Updated") {
        Write-Host "Success: Updated employee details" -ForegroundColor Green
    } else {
        Write-Host "Failed: Update not reflected" -ForegroundColor Red
    }
} catch {
    Write-Host "Failed to update employee: $_" -ForegroundColor Red
}

# 5. Test Delete Employee
Write-Host "`n5. Testing Delete Employee ($createdId)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Method Delete -Uri "$baseUrl/$createdId"
    Write-Host "Success: Delete request sent" -ForegroundColor Green
} catch {
    Write-Host "Failed to delete employee: $_" -ForegroundColor Red
}

# 6. Verify Deletion
Write-Host "`n6. Verifying Deletion..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Method Get -Uri "$baseUrl/$createdId"
    Write-Host "Failed: Employee still exists" -ForegroundColor Red
} catch {
    # 404 is expected here
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "Success: Employee not found (404) as expected" -ForegroundColor Green
    } else {
        Write-Host "Unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host "`nAll Tests Completed." -ForegroundColor Cyan
