# API Automation Testing with Postman, Newman, and CI/CD

## Source Code

This project website with bugs source code is based on Practice Software Testing application:
https://github.com/testsmith-io/practice-software-testing/ (Sprint 5 with bugs)

## Objectives

- Learn API testing with Postman
- Implement data-driven testing using CSV files
- Integrate automated testing with Newman and GitHub Actions
- Set up CI/CD pipeline for automated API testing

---

## 1. Project Structure

```
api-automation-practice/
├── .github/
│   └── workflows/
│       └── api-test.yml         # GitHub Actions workflow file
├── sprint5-with-bugs/
│   └── API/
│       └── .env.ci              # Environment template for CI
├── tests/
│   └── api/
│       ├── 1_Login.postman_collection.json      # Login API testing collection
│       ├── 2_Me.postman_collection.json         # User profile API testing collection
│       ├── 3_Change_password.postman_collection.json # Password change API testing collection
│       ├── login.json           # Postman environment
│       └── data/                # Data-driven testing data files
├── run-api-tests.sh             # Newman execution script (bash)
├── run-api-tests.ps1            # Newman execution script (PowerShell)
└── README.md                    # This documentation
```

---

## 2. Requirements & Tasks

### Requirement 1: Data-driven Testing with Postman

**Important Setup:** Before starting, you need to launch the application and create test data:

```bash
# Start Docker containers
docker-compose up -d

# Wait approximately 60 seconds for services to fully start

# Create database and seed data
docker compose exec laravel-api php artisan migrate:fresh --seed --force

# Check application: http://localhost:8091 (API), http://localhost:8092 (UI)
```

### 🔧 Troubleshooting

**If database creation fails or `vendor` folder doesn't appear in `sprint5-with-bugs/API/` after 60 seconds:**

```bash
# Install PHP dependencies (Laravel packages)
docker compose run --rm composer
# Select YES

# Then run database creation again
docker compose exec laravel-api php artisan migrate:fresh --seed --force
```

**Common errors:**

- ❌ `Class not found` → Run `docker compose run --rm composer`
- ❌ `Database connection failed` → Check .env file and wait

**Steps:**

1. Import the existing collections and environment from `tests/api` into Postman:

   - `1_Login.postman_collection.json` - Tests user authentication endpoints
   - `2_Me.postman_collection.json` - Tests user profile management endpoints
   - `3_Change_password.postman_collection.json` - Tests password change functionality
   - `login.json` - Environment configuration

2. Create data files in `tests/api/data/` directory for each collection as needed.

   **Sample account data for login testing:**

   | email                                | password  | expected_status |
   | ------------------------------------ | --------- | --------------- |
   | admin@practicesoftwaretesting.com    | welcome01 | 200             |
   | customer@practicesoftwaretesting.com | welcome01 | 200             |
   | invalid@practicesoftwaretesting.com  | wrongpass | 401             |

3. Modify the collections to use variables from the data files in requests (e.g., `{{email}}`, `{{password}}`).
4. Test each collection individually with the corresponding data files in Postman using "Run Collection" and select the appropriate data file.
5. Export the modified collections and replace the old files in `tests/api` if needed.

---

### Step 2: Running Newman Locally

**Prerequisites:** Install Newman and Newman HTML Extra reporter

```bash
npm install -g newman-reporter-htmlextra
```

**Note**: Before running, remember to stop Docker containers (`docker compose down`)

1. Open the `run-api-tests.sh` file (or `run-api-tests.ps1` if using PowerShell on Windows) and find the line with comment:

   ```
   # Newman here
   ```

   Add Newman commands to execute all three test collections with environment and data files below this line:

   - Login API tests (`1_Login.postman_collection.json`)
   - User profile API tests (`2_Me.postman_collection.json`)
   - Password change API tests (`3_Change_password.postman_collection.json`)

2. Run the script locally to check results and generate test reports.

   **Script execution guide:**

   Open terminal, navigate to the project root directory, and run:

   ```bash
   chmod +x run-api-tests.sh
   ./run-api-tests.sh
   ```

   If you get "Permission denied" error, grant execution permission with `chmod +x run-api-tests.sh` before running.

   After execution, check the test results and generated reports in the current directory (or path specified by the script).

   ***

   ✅ **Running PowerShell script on Windows:**

   1. Save the script as `run-api-tests.ps1`.
   2. Open PowerShell as administrator (if needed).
   3. If script execution is blocked, allow it with:

      ```powershell
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
      ```

   4. Run the script:

      ```powershell
      .\run-api-tests.ps1
      ```

   After execution, check the test results and generated reports in the current directory (or path specified by the script).

---

### Requirement 3: GitHub Actions Integration

1. **Create a new GitHub repository** and push all your code to this repository.

2. **Set up required secrets on the GitHub repository.**

   > **Note:** These secrets correspond to values in the `ci.env` file in the `API` directory.  
   > For example, if the `ci.env` file contains:
   >
   > ```
   > APP_KEY=base64:xxxxxxx
   > DB_DATABASE=practice_software_testing
   > DB_USERNAME=root
   > DB_PASSWORD=password
   > JWT_SECRET=your-jwt-secret
   > ```
   >
   > You need to create GitHub secrets with corresponding names and values:
   >
   > - `APP_KEY`
   > - `DB_DATABASE`
   > - `DB_USERNAME`
   > - `DB_PASSWORD`
   > - `JWT_SECRET`

3. **Open the workflow file [`api-test.yml`](.github/workflows/api-test.yml)** and find the step with comment:

   ```yaml
   # Newman here
   ```

   Add Newman execution commands for all three collections at this location to perform automated testing:

   - Login API tests
   - User profile API tests
   - Password change API tests

4. **Ensure the workflow includes a step to upload test reports to Artifacts** for storage and download after testing completion.

5. **Push code to GitHub and monitor the GitHub Actions execution.**  
   After workflow completion, download the test report from Artifacts to view results.

---

## 3. Expected Results

- All three collections (Login, Me, Change Password) run successfully with their respective data files on both Postman and Newman
- Individual test reports are generated for each collection
- Test reports are generated and uploaded successfully to GitHub Actions
- Complete automated testing process is implemented through CI/CD pipeline covering login, user profile, and password management functionality

---

## 4. References

- Main Application: https://github.com/testsmith-io/practice-software-testing/
- Group Seminar Reference: https://github.com/KRaito903/api-automation-practice
