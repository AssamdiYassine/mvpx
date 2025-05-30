# MVP Twitter-like Platform

This monorepo contains:
- **frontend/**: Next.js app (TypeScript, Tailwind CSS, Redux)
- **backend/**: NestJS API (TypeScript, PostgreSQL, Stripe)

## Features
- User authentication (JWT)
- Article creation (public & subscriber-only)
- Follow/unfollow users
- Subscription & payment (Stripe)

## Getting Started

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run start:dev
```

## Environment
- Configure PostgreSQL and Stripe keys in backend `.env` file.
