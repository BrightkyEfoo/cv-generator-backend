# CV Generator - Backend API

Backend API pour le generateur de CV professionnel avec generation PDF, templates personnalisables et paiement Stripe.

## Table des matieres

- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequis](#prerequis)
  - [Installation locale](#installation-locale)
  - [Installation avec Docker](#installation-avec-docker)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Templates](#templates)
- [Structure du projet](#structure-du-projet)

## Technologies

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Langage**: TypeScript
- **Base de donnees**: PostgreSQL 16
- **ORM**: Prisma
- **Generation PDF**: Puppeteer
- **Templates**: Edge.js
- **Paiement**: Stripe
- **Containerisation**: Docker

## Architecture

Le projet suit une architecture Clean Architecture avec les principes SOLID:

```
src/
├── domain/           # Entites et logique metier
├── application/      # Cas d'utilisation et interfaces
├── infrastructure/   # Implementations (DB, services externes)
├── presentation/     # Controllers et routes HTTP
└── shared/           # Utilitaires partages
```

## Installation

### Prerequis

- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- npm ou yarn

### Installation locale

1. **Cloner le projet et installer les dependances**

```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement**

```bash
cp .env.example .env
# Editer .env avec vos valeurs
```

3. **Configurer la base de donnees**

```bash
# Generer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Initialiser les donnees (templates, admin, previews)
npm run db:seed
```

4. **Lancer le serveur de developpement**

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3001`

### Installation avec Docker

1. **Configurer les variables d'environnement**

```bash
cp .env.example .env
# Editer .env avec vos valeurs (notamment STRIPE_SECRET_KEY)
```

2. **Lancer avec Docker Compose**

```bash
# Demarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arreter les services
docker-compose down
```

3. **Commandes utiles Docker**

```bash
# Reconstruire l'image apres modifications
docker-compose up -d --build

# Acceder au shell du container backend
docker-compose exec backend sh

# Voir les logs PostgreSQL
docker-compose logs postgres

# Supprimer les volumes (reset complet de la DB)
docker-compose down -v
```

## Configuration

| Variable | Description | Defaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement (development/production) | development |
| `PORT` | Port du serveur | 3001 |
| `DATABASE_URL` | URL de connexion PostgreSQL | - |
| `POSTGRES_USER` | Utilisateur PostgreSQL (Docker) | postgres |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL (Docker) | password |
| `POSTGRES_DB` | Nom de la base de donnees | cv_generator |
| `STRIPE_SECRET_KEY` | Cle secrete Stripe | - |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | - |
| `FRONTEND_URL` | URL du frontend pour CORS | http://localhost:3000 |
| `MAX_FILE_SIZE_MB` | Taille max des uploads (MB) | 5 |
| `ADMIN_JWT_SECRET` | Secret JWT pour l'admin | - |
| `ADMIN_PASSWORD` | Mot de passe admin initial | admin123 |

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Demarrer en mode developpement avec hot-reload |
| `npm run build` | Compiler TypeScript |
| `npm start` | Demarrer en production |
| `npm run lint` | Verifier les types TypeScript |
| `npm run db:generate` | Generer le client Prisma |
| `npm run db:migrate` | Creer une migration |
| `npm run db:push` | Appliquer le schema a la DB |
| `npm run db:seed` | Initialiser les donnees |
| `npm run db:studio` | Ouvrir Prisma Studio |

## API Endpoints

### Health Check

```
GET /api/health
```

### CV

```
POST   /api/cv              # Creer un CV
GET    /api/cv/:id          # Recuperer un CV
PUT    /api/cv/:id          # Mettre a jour un CV
DELETE /api/cv/:id          # Supprimer un CV
GET    /api/cv/:id/preview  # Generer un PDF preview (watermark)
GET    /api/cv/:id/download # Telecharger le PDF (apres paiement)
```

### Templates

```
GET    /api/templates       # Lister tous les templates
GET    /api/templates/:id   # Details d'un template
```

### Paiements

```
POST   /api/payments/create-intent  # Creer une intention de paiement
POST   /api/webhooks/stripe         # Webhook Stripe
```

### Uploads

```
POST   /api/uploads/photo   # Uploader une photo de profil
```

### Admin

```
POST   /api/admin/login              # Connexion admin
GET    /api/admin/templates          # Lister les templates (admin)
POST   /api/admin/templates          # Creer un template
PUT    /api/admin/templates/:id      # Modifier un template
DELETE /api/admin/templates/:id      # Supprimer un template
```

## Templates

8 templates CV professionnels sont inclus:

| Template | Style | Caracteristiques |
|----------|-------|------------------|
| Corporate Red | Professional | Sidebar sombre, accents rouges |
| Dark Tech | Modern | Theme sombre, accents teal |
| Purple Modern | Modern | Design en cartes, theme violet |
| Cyan Professional | Professional | Deux colonnes, header cyan |
| Gradient Dark | Creative | Theme sombre avec degrades |
| Classic Clean | Simple | Minimaliste, typographie elegante |
| Teal Sidebar | Professional | Sidebar teal pour contact/skills |
| Orange Creative | Creative | Accents orange, visualisation skills |

Les templates utilisent **Edge.js** comme moteur de template et sont stockes dans:
```
src/infrastructure/templates/edges/
```

Les previews sont generes automatiquement au premier demarrage et stockes dans:
```
public/previews/
```

## Structure du projet

```
backend/
├── prisma/
│   ├── schema.prisma       # Schema de la base de donnees
│   └── seed.ts             # Script d'initialisation
├── public/
│   └── previews/           # Images preview des templates
├── src/
│   ├── domain/
│   │   └── entities/       # Entites metier (CV, Template, Payment)
│   ├── application/
│   │   ├── interfaces/     # Contrats (repositories, services)
│   │   └── use-cases/      # Logique applicative
│   ├── infrastructure/
│   │   ├── persistence/    # Repositories Prisma
│   │   ├── services/       # Services externes (PDF, Stripe)
│   │   └── templates/      # Templates Edge.js
│   ├── presentation/
│   │   ├── controllers/    # Controllers HTTP
│   │   ├── routes/         # Definition des routes
│   │   └── middleware/     # Middlewares Express
│   ├── shared/             # Utilitaires partages
│   ├── app.ts              # Configuration Express
│   ├── container.ts        # Injection de dependances
│   └── index.ts            # Point d'entree
├── uploads/                # Fichiers uploades
├── docker-compose.yml      # Configuration Docker
├── Dockerfile              # Image Docker
└── package.json
```

## Securite

- Les mots de passe admin sont hashes avec SHA-256
- JWT pour l'authentification admin
- Helmet pour les headers de securite
- CORS configure pour le frontend
- Validation des uploads (type, taille)
- Pas de compte utilisateur requis (session-based)

## License

MIT
