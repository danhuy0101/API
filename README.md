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
│       ├── collection.json      # Postman collection (to be updated)
│       ├── environment.json     # Postman environment
│       └── user-accounts.csv    # Data-driven testing data file
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

1. Import the existing collection and environment from `tests/api` into Postman.
2. Create a `user-accounts.csv` file in `tests/api` with fields: `email`, `password`, `expected_status`.

   **Sample account data:**

   | email                                | password  | expected_status |
   | ------------------------------------ | --------- | --------------- |
   | admin@practicesoftwaretesting.com    | welcome01 | 200             |
   | customer@practicesoftwaretesting.com | welcome01 | 200             |
   | invalid@practicesoftwaretesting.com  | wrongpass | 401             |

3. Modify the collection to use variables from the CSV file in requests (e.g., `{{email}}`, `{{password}}`).
4. Test the collection with the CSV file in Postman using "Run Collection" and select the data file.
5. Export the modified collection and replace the old file in `tests/api`.

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

   Add more Newman command to execute tests with collection, environment, and CSV file below this line.

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

   Add more Newman execution command at this location if needed to perform automated testing.

4. **Ensure the workflow includes a step to upload test reports to Artifacts** for storage and download after testing completion.

5. **Push code to GitHub and monitor the GitHub Actions execution.**  
   After workflow completion, download the test report from Artifacts to view results.

---

## 3. Expected Results

- Collection runs successfully with CSV data on both Postman and Newman
- Test reports are generated and uploaded successfully to GitHub Actions
- Complete automated testing process is implemented through CI/CD pipeline

---

## 4. References

- Main Application: https://github.com/testsmith-io/practice-software-testing/
- Group Seminar Reference: https://github.com/KRaito903/api-automation-practice
