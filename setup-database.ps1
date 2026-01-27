# Run this in PowerShell to set up the database

Write-Host "🔧 Setting up BugPulse PostgreSQL Database..." -ForegroundColor Cyan

# Check if PostgreSQL is installed
Write-Host "`n1. Checking PostgreSQL installation..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ PostgreSQL found" -ForegroundColor Green

# Create database
Write-Host "`n2. Creating database 'bugpulse_auth'..." -ForegroundColor Yellow
$createDb = @"
CREATE DATABASE bugpulse_auth;
"@

$createDb | psql -U postgres -c

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database might already exist (this is OK)" -ForegroundColor Yellow
}

# Run migration
Write-Host "`n3. Running database migration..." -ForegroundColor Yellow
$migrationPath = Join-Path $PSScriptRoot "server\migrations\001_create_tables.sql"
psql -U postgres -d bugpulse_auth -f $migrationPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration completed" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    exit 1
}

# Check .env file
Write-Host "`n4. Checking environment configuration..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "server\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    $envExamplePath = Join-Path $PSScriptRoot "server\.env.example"
    Copy-Item $envExamplePath $envPath
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit server\.env and update DB_PASSWORD and JWT_SECRET" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit server\.env with your database password" -ForegroundColor White
Write-Host "2. Run: cd server && npm run dev" -ForegroundColor White
Write-Host "3. Run: cd client && npm run dev (in another terminal)" -ForegroundColor White
Write-Host "4. Visit: http://localhost:5173/login" -ForegroundColor White
Write-Host "`n🎉 Happy debugging!" -ForegroundColor Cyan
