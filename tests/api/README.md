# API Testing Setup - Enhanced Reporting

## Overview

This setup provides comprehensive API testing with detailed reporting that clearly maps test cases to input data.

## Key Improvements

### 1. Enhanced Test Data Structure (`login.json`)

- **Test Case IDs**: Each test now has a unique identifier (TC001, TC002, etc.)
- **Detailed Descriptions**: Clear descriptions including test case purpose
- **Expected Results**: What each test should achieve
- **More Test Cases**: Added edge cases like empty fields, malformed emails, etc.

### 2. Improved PowerShell Script (`run-api-tests.ps1`)

- **HTML Extra Reporter**: Uses `newman-reporter-htmlextra` for detailed reporting
- **Enhanced Logging**: Includes `--verbose` and `--reporter-htmlextra-logs` flags
- **Better Report Title**: Sets a custom title for the HTML report

### 3. Enhanced Postman Collection Test Scripts

- **Visual Indicators**: Uses emojis (✅, ❌, ⚠️) for easy identification
- **Test Case IDs in Names**: Each test name includes the test case ID
- **Detailed Console Logging**: Logs input data, expected results, and actual responses
- **Better Traceability**: Maps each iteration to specific test data

## Test Case Mapping

| Test Case ID | Description             | Email                                 | Password  | Expected Result     |
| ------------ | ----------------------- | ------------------------------------- | --------- | ------------------- |
| TC001        | Valid admin login       | admin@practicesoftwaretesting.com     | welcome01 | ✅ Success          |
| TC002        | Invalid admin password  | admin@practicesoftwaretesting.com     | welcome   | ❌ 401 Error        |
| TC003        | Valid customer login    | customer@practicesoftwaretesting.com  | welcome01 | ✅ Success          |
| TC004        | Valid customer2 login   | customer2@practicesoftwaretesting.com | welcome01 | ✅ Success          |
| TC005        | Email with spaces       | " customer2@... "                     | welcome01 | ✅ Success          |
| TC006        | Non-existent email      | abc@practicesoftwaretesting.com       | pass123   | ❌ 401 Error        |
| TC007        | Empty email             | ""                                    | welcome01 | ❌ Validation Error |
| TC008        | Empty password          | customer@...                          | ""        | ❌ Validation Error |
| TC009        | Malformed email         | invalid-email                         | welcome01 | ❌ Validation Error |
| TC010        | Case-sensitive password | admin@...                             | WELCOME01 | ❌ 401 Error        |

## Generated Reports

### 1. Detailed HTML Report

- **Location**: `tests/api/report/detailed-result.html`
- **Features**:
  - Interactive dashboard
  - Individual test case details
  - Request/Response data for each iteration
  - Console logs showing input data mapping
  - Pass/Fail statistics per test case

### 2. Console Output

- **Real-time Logging**: Shows test case ID, description, and input data
- **Visual Indicators**: Color-coded success/failure indicators
- **Detailed Traceability**: Maps each test execution to input data

## How to Run

```powershell
.\run-api-tests.ps1
```

## Report Analysis

After running tests, open `tests/api/report/detailed-result.html` in a browser to see:

1. **Summary Dashboard**: Overall pass/fail statistics
2. **Iteration Details**: Each test case with input data clearly labeled
3. **Console Logs**: Detailed logging showing the mapping between input and output
4. **Request/Response**: Complete API request and response for each test case

## Benefits

1. **Clear Traceability**: Each test result is clearly mapped to its input data
2. **Better Debugging**: Failed tests show exactly which input caused the failure
3. **Professional Reporting**: HTML reports suitable for stakeholder review
4. **Test Case Management**: Easy to identify and track individual test scenarios
5. **Enhanced Logging**: Console output provides real-time feedback during execution
