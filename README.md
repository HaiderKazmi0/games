# Game Review Platform

A full-featured game review platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (signup/login)
- Game listing and details
- Rating system (1-5 stars)
- Voting system (upvote/downvote)
- Comments system
- Responsive design
- SQLite database with Prisma ORM

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd game-review-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

4. Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Default Test Account

- Email: test@example.com
- Password: password123

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations
- `scripts/` - Database seeding script

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- NextAuth.js
- React Hot Toast

## License

MIT
