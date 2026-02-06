# Bugpulse VPS Deployment (Hostinger KVM)

This guide deploys the backend + judging runner in a Docker container and sets up PostgreSQL. It assumes Ubuntu on a KVM VPS.

## 0) Prerequisites
- VPS is KVM (not OpenVZ/LXC)
- Ubuntu with sudo access
- Public IP and SSH access
- Your repo: https://github.com/subhrajyoti5/bugrank.git

## 1) Log in and update
```bash
ssh <user>@<VPS_IP>

sudo apt update && sudo apt upgrade -y
```

## 2) Install Docker and Git
```bash
sudo apt install -y ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```
Log out and back in so `docker` works without sudo.

## 3) Clone the repo
```bash
git clone https://github.com/subhrajyoti5/bugrank.git
cd bugrank
```

## 4) Configure backend environment
Create or edit `server/.env` on the VPS:
```env
# Database
DB_USER=postgres
DB_HOST=postgres
DB_NAME=bugpulse_auth
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=production

# Gemini (optional but recommended)
GEMINI_API_KEY=your_gemini_api_key
```

## 5) Create Docker network
```bash
docker network create bugpulse-net
```

## 6) Run PostgreSQL in Docker
```bash
docker run -d \
  --name bugpulse-postgres \
  --network bugpulse-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_postgres_password \
  -e POSTGRES_DB=bugpulse_auth \
  -p 5432:5432 \
  postgres:15
```

## 7) Run migrations (one-time)
```bash
docker exec -it bugpulse-postgres psql -U postgres -d bugpulse_auth -f /docker-entrypoint-initdb.d/001_create_tables.sql
```
This command expects the SQL file inside the container. You can copy it first:
```bash
docker cp server/migrations/001_create_tables.sql bugpulse-postgres:/docker-entrypoint-initdb.d/001_create_tables.sql
```
Then run the migration:
```bash
docker exec -it bugpulse-postgres psql -U postgres -d bugpulse_auth -f /docker-entrypoint-initdb.d/001_create_tables.sql
```
(Optional) Seed challenges:
```bash
docker cp server/migrations/002_seed_challenges.sql bugpulse-postgres:/docker-entrypoint-initdb.d/002_seed_challenges.sql

docker exec -it bugpulse-postgres psql -U postgres -d bugpulse_auth -f /docker-entrypoint-initdb.d/002_seed_challenges.sql
```

## 8) Build backend image (includes judge runner)
```bash
docker build -t bugpulse-backend .
```

## 9) Run backend container
```bash
docker run -d \
  --name bugpulse-backend \
  --network bugpulse-net \
  -p 5000:5000 \
  --env-file server/.env \
  bugpulse-backend
```

## 10) Verify
```bash
curl http://<VPS_IP>:5000/health
```
Expected JSON with `success: true`.

## 11) Frontend (optional)
If you host the frontend separately, set:
```env
VITE_API_URL=http://<VPS_IP>:5000
```

## Notes
- The judging runner is inside the backend container. No separate judge service is required.
- Make sure `NODE_ENV=production` in `server/.env` so the runner path is `/srv/bugpulse/runner/run_cpp.sh`.
- If you see database errors, recheck DB credentials and that the Postgres container is running.

## Common Commands
```bash
# Logs
docker logs -f bugpulse-backend

# Restart
docker restart bugpulse-backend

# Check containers
docker ps
```
