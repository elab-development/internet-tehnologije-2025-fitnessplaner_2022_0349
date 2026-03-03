# Fitness Planer

## Opis aplikacije

Fitness Planer je moderna, Full-Stack web aplikacija namenjena korisnicima koji žele da detaljno prate svoju ishranu, makronutrijente i fitnes napredak..

Aplikacija omogućava pretragu i unos namirnica (integracija sa OpenFoodFacts bazom), kalkulaciju dnevnog unosa kalorija (P, UH, M) i naprednu vizualizaciju podataka putem interaktivnih grafikona. Jedna od ključnih funkcionalnosti je i integrisani **AI Nutricionista** (pokretan Groq API modelom) koji analizira dnevnik ishrane i daje personalizovane savete. Sistem sadrži i kompletnu **RBAC** (Role-Based Access Control) zaštitu za različite tipove korisnika (klijent, trener, admin).

---

## Tehnologije

| Kategorija | Tehnologije |
|---|---|
| Backend | PHP 8.2, Laravel 11.x |
| Frontend | React 18, Vite, React Router DOM |
| Baza podataka | MySQL 8.0 (produkcija/lokal) / SQLite (in-memory za testove) |
| Vizualizacija | Recharts |
| Infrastruktura & CI/CD | Docker, Docker Compose, GitHub Actions, Railway |
| API Integracije | Groq AI API, OpenFoodFacts API |

---

## Struktura grana (Git Flow)

| Grana | Opis |
|---|---|
| `main` | Stabilna produkciona verzija. Svaki push pokreće CI/CD pipeline koji testira i deploy-uje na Railway. |
| `develop` | Glavna integraciona grana. Ovde se spajaju sve nove funkcionalnosti pre prebacivanja u produkciju. |
| `feature/external-apis` | Integracija sa LLM modelom za AI nutricionistu koji pruža personalizovana mišljenja o ishrani. |
| `feature/swagger` | Implementacija automatske API dokumentacije koristeći dedoc/scramble. |
| `feature/docker` | Kontejnerizacija aplikacije; postavljanje Dockerfile-a, docker-compose-a. |

---

## Lokalno pokretanje (bez Docker-a)

### 1. Kloniranje i instalacija zavisnosti
```bash
git clone <URL_VASEG_REPOZITORIJUMA>
cd fitness-planer
composer install
npm install
```

### 2. Konfiguracija okruženja
```bash
cp .env.example .env
php artisan key:generate
```

> U `.env` fajlu podesite podatke za lokalnu MySQL bazu: `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.

### 3. Migracije i pokretanje
```bash
php artisan migrate
```

Otvorite dva terminala:
```bash
# Terminal 1 — Backend
php artisan serve

# Terminal 2 — Frontend
npm run dev
```

Aplikacija će biti dostupna na **http://127.0.0.1:8000**

---

## Pokretanje pomoću Docker-a

### 1. Priprema `.env` fajla
```bash
cp .env.example .env
```

> U `.env` fajlu postavite `DB_HOST=db` (naziv Docker servisa baze).

### 2. Pokretanje kontejnera
```bash
docker-compose up -d --build
```

### 3. Instalacija paketa i migracija
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

### 4. Pristup aplikaciji

| Servis | URL |
|---|---|
| Web aplikacija | http://localhost:8000 |
| phpMyAdmin | http://localhost:8080 |

### Gašenje okruženja
```bash
docker-compose down
```