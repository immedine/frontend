# Roods App Admin Panel

<div align="center"><strong>Admin Dashboard for Roods Mobile App</strong></div>
<div align="center">Built with Next.js 14 and Shadcn UI</div>

## Overview

This is the admin panel for the Roods mobile app, allowing administrators to manage stories, routes, and destinations. Built with:

- Framework - [Next.js 14](https://nextjs.org/)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Forms - [React Hook Form](https://react-hook-form.com)
- Validation - [Zod](https://zod.dev)

## Features

| Feature            | Description                                         |
| :----------------- | :-------------------------------------------------- |
| Authentication     | Secure admin login with role-based access           |
| Content Management | Create and manage stories, routes, and destinations |
| Media Management   | Upload and manage images for content                |
| User Management    | Manage admin users and their permissions            |
| Profile Management | Update admin profile and security settings          |

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/roods-admin.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

4. Add required environment variables to `.env.local`

5. Start the development server:

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=your_api_url
# Add other required environment variables
```

## Project Structure

```
src/
  ├── app/              # Next.js app router pages
  ├── components/       # Reusable UI components
  ├── lib/             # Utilities and helpers
  └── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
