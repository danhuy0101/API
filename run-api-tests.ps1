Write-Host " Starting API Login Tests..."

# Start Docker services
Write-Host " Starting Docker containers..."
docker compose -f docker-compose.yml up -d --force-recreate

# Wait for services
Write-Host " Waiting for services to be ready..."
Start-Sleep -Seconds 60

# Install composer dependencies
Write-Host " Installing composer dependencies..."
docker compose exec laravel-api composer install --no-dev --optimize-autoloader

# Setup database
Write-Host " Setting up database..."
docker compose exec laravel-api php artisan migrate --force
docker compose exec laravel-api php artisan db:seed --force

# Check if Newman is installed
if (-not (Get-Command newman -ErrorAction SilentlyContinue)) {
    Write-Host " Installing Newman..."
    npm install -g newman newman-reporter-htmlextra newman-reporter-html
}

# Run tests with enhanced reporting
Write-Host "Running API tests with detailed reporting..."
# Newman here
Write-Host "API Post Brand Tests"
newman run "tests/api/1_PostBrand.postman_collection.json" --iteration-data "tests/api/data/1_PostBrand.json" --reporters "cli,htmlextra" --reporter-htmlextra-export "tests/api/report/1_Login_detailed-result.html" --reporter-htmlextra-title "API Login Tests Report" --reporter-htmlextra-logs --verbose

Write-Host "Refreshing database..."
docker compose exec laravel-api php artisan migrate:fresh --seed

Write-Host "API Get Brand Tests"
newman run "tests/api/2_GetBrand.postman_collection.json" --iteration-data "tests/api/data/2_GetBrand.json" --reporters "cli,htmlextra" --reporter-htmlextra-export "tests/api/report/2_User_Details_detailed-result.html" --reporter-htmlextra-title "API User Details Tests Report" --reporter-htmlextra-logs --verbose

Write-Host "Refreshing database..."
docker compose exec laravel-api php artisan migrate:fresh --seed

Write-Host "API Put Brand Tests"
newman run "tests/api/3_PutBrand.postman_collection.json" --iteration-data "tests/api/data/3_PutBrand.json" --reporters "cli,htmlextra" --reporter-htmlextra-export "tests/api/report/3_Put_Brand_detailed-result.html" --reporter-htmlextra-title "API Put Brand Tests Report" --reporter-htmlextra-logs --verbose

# Cleanup
Write-Host " Stopping Docker containers..."
docker compose down