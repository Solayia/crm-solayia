# Deploiement CRM Solayia — VPS 2

## Prerequis sur le VPS

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y postgresql-16

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx

# Certbot (SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

## 1. Creer la base de donnees

```bash
sudo -u postgres psql
```

```sql
CREATE USER crm_user WITH PASSWORD 'MOT_DE_PASSE_FORT';
CREATE DATABASE crm_solayia OWNER crm_user;
GRANT ALL PRIVILEGES ON DATABASE crm_solayia TO crm_user;
\q
```

## 2. Cloner le repo

```bash
sudo mkdir -p /var/www/crm-solayia
cd /var/www/crm-solayia
git clone https://github.com/Solayia/crm-solayia.git .
git checkout main
```

## 3. Configurer le backend

```bash
cd backend
cp .env.example .env
nano .env
# Remplir : DATABASE_URL, JWT_SECRET (openssl rand -hex 64), SEED_ADMIN_PASSWORD
```

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

## 4. Build frontend

```bash
cd ../frontend
cp .env.example .env
nano .env
# VITE_API_URL=https://crm.solayia.fr
```

```bash
npm install
npm run build
```

## 5. Demarrer avec PM2

```bash
cd ../backend
pm2 start src/server.js --name crm-solayia-api
pm2 save
pm2 startup
```

## 6. Configurer Nginx + SSL

```bash
sudo cp /var/www/crm-solayia/nginx/crm.solayia.fr.conf /etc/nginx/sites-available/crm.solayia.fr
sudo ln -s /etc/nginx/sites-available/crm.solayia.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

```bash
# SSL avec Let's Encrypt
sudo certbot --nginx -d crm.solayia.fr
```

## 7. Verifier que le bot Telegram tourne toujours

```bash
pm2 list
# Le bot Telegram doit etre dans la liste et en status "online"
```

## Mise a jour

```bash
cd /var/www/crm-solayia
git pull origin main
cd backend && npm install && npx prisma migrate deploy
cd ../frontend && npm install && npm run build
pm2 restart crm-solayia-api
```
