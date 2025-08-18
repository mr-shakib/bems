# BEMS - Business Enterprise Management System

A modern, full-stack business management platform built with Next.js 14, TypeScript, and Appwrite. BEMS provides comprehensive workspace management, project collaboration, and team member administration capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)

## 🚀 Features

### 🏢 Workspace Management

- Create and manage multiple workspaces
- Workspace-specific dashboards
- Image upload for workspace branding
- Workspace switching interface

### 📋 Project Management

- Create and organize projects within workspaces
- Project avatars and visual identification
- Project-specific routing and organization
- Collaborative project environments

### 👥 Team Management

- Member invitation and management
- Role-based access control
- Member avatars and profiles
- Team collaboration tools

### 🔐 Authentication & Security

- Secure user registration and login
- Session management with Appwrite
- Protected routes and middleware
- Email validation and password policies

### 🎨 Modern UI/UX

- Responsive design with Tailwind CSS
- Dark/light theme support
- Radix UI components
- Mobile-first approach with sidebar navigation
- Toast notifications and loading states

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend & Database

- **Appwrite** - Backend-as-a-Service
- **Hono** - Web framework for API routes
- **Server-only** - Server-side code isolation

### State Management & Data Fetching

- **TanStack Query** - Server state management
- **React Query** - Caching and synchronization
- **Nuqs** - URL state management

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Date-fns** - Date manipulation

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mr-shakib/bems.git
   cd bems
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
   NEXT_APPWRITE_KEY=your_api_key

   # Database Collections
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
   NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id
   NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your_projects_collection_id
   NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_images_bucket_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main dashboard
│   ├── (standalone)/      # Standalone pages
│   └── api/               # API routes
├── components/            # Shared UI components
│   └── ui/               # Base UI components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication
│   ├── workspaces/      # Workspace management
│   ├── projects/        # Project management
│   └── members/         # Member management
├── hooks/               # Custom React hooks
└── lib/                 # Utilities and configurations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚪 Application Routes

### Authentication

- `/sign-in` - User login
- `/sign-up` - User registration

### Dashboard

- `/` - Home (redirects to workspace)
- `/workspaces/[workspaceId]` - Workspace dashboard
- `/workspaces/create` - Create new workspace

## 🎨 UI Components

The project uses a comprehensive design system built on:

- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **Custom components** in `src/components/ui/`
- **Feature-specific components** in respective feature directories

## 🔐 Authentication Flow

1. Users register/login through Appwrite authentication
2. Sessions are managed with secure cookies
3. Protected routes redirect unauthenticated users
4. Workspace access is controlled per user

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar navigation
- Responsive modals and forms
- Touch-friendly interfaces

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the excellent React framework
- [Appwrite](https://appwrite.io/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

For support, email [contactshakibhere@gmail.com] or create an issue in this repository.

---

Built with ❤️ by [mr-shakib](https://github.com/mr-shakib)
