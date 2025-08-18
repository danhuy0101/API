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
newman run "tests/api/test.postman_collection.json" --iteration-data "tests/api/login.json" --reporters "cli,htmlextra" --reporter-htmlextra-export "tests/api/report/detailed-result.html" --reporter-htmlextra-title "API Login Tests Report" --reporter-htmlextra-logs --verbose

# Cleanup
Write-Host " Stopping Docker containers..."
docker compose down
