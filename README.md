# Insurance Agency - Policy

A modern Insurance Agency System (IAS) web application for policy management, built with Vite, React, and TypeScript.

## Overview

This application provides a comprehensive interface for managing insurance policies, including policy creation, viewing, editing, and administration. It features a modern UI with dark/light theme support and multi-language capabilities.

## Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios with React Query
- **Internationalization**: i18next
- **Form Handling**: React Hook Form with Zod validation
- **Package Manager**: npm/bun

## Features

- 📋 **Policy Management**: Create, view, edit, and delete insurance policies
- 🎨 **Theme Support**: Light, dark, and system theme modes
- 🌍 **Multi-language**: Support for 9 languages
- 📱 **Responsive Design**: Mobile-first responsive UI
- 🔍 **Advanced Search**: Policy search and filtering capabilities
- 📊 **Dashboard Metrics**: Policy statistics and analytics
- 🛡️ **Role-based Access**: Permission-based feature access
- ⚡ **Performance**: Optimized with React Query caching

## Getting Started

### Prerequisites

- Node.js 18+ (recommended to install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or bun package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd ias-policies-ui

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Development Scripts

```sh
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Policy-specific components
│   ├── customUI/       # Custom UI components
│   └── ui/            # shadcn/ui components
├── context/           # React context providers
├── functions/         # Utility functions
├── hooks/            # Custom React hooks
│   ├── mutations/    # React Query mutations
│   └── queries/      # React Query queries
├── lib/              # Core utilities and configurations
├── pages/            # Page components
├── services/         # API service functions
├── store/            # Zustand stores
├── translations/     # i18n translation files
└── types/           # TypeScript type definitions
```

## Key Components

### Policy Management
- **PolicyCard**: Display policy summary information
- **PolicyTable**: Tabular view of policies with sorting and filtering
- **PolicyCreationModal**: Form for creating new policies
- **PolicyDetailView**: Detailed view of individual policies
- **PolicyUploadModal**: Bulk policy upload interface

### Data Management
- **DataTable**: Reusable data table with pagination and search
- **MetricCards**: Dashboard statistics display
- **SearchBox**: Advanced search functionality

## API Integration

The application integrates with backend services through:
- `policyServices.ts`: Policy CRUD operations
- `authServices.ts`: Authentication and authorization
- `commonServices.ts`: Shared utility services
- `partnerServices.ts`: Partner management

All API calls are handled with React Query for caching and state management.

## Theme System

The application supports comprehensive theming with:
- Light, dark, and system preference modes
- Smooth theme transitions
- Persistent theme preferences
- Host application integration support

### Theme Usage

```typescript
import { useTheme } from '@/lib/theme-context';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {resolvedTheme}
    </button>
  );
}
```

### Host Integration

For micro-frontend scenarios:

```typescript
// Access theme from host application
const remoteTheme = window.__REMOTE_THEME__;

// Get/set theme
const currentTheme = remoteTheme?.getTheme();
remoteTheme?.setTheme('dark');
```

## Internationalization (i18n)

### Supported Languages

The application supports 9 languages:
- 🇺🇸 English (en) - Default
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇸🇦 Arabic (ar)
- 🇻🇳 Vietnamese (vi)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)

### Translation Structure

```
src/translations/
├── en/common.json
├── es/common.json
├── fr/common.json
└── ...
```

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <button onClick={() => i18n.changeLanguage('es')}>
        Español
      </button>
    </div>
  );
}
```

### Translation Namespaces

- `common`: General UI elements
- `messages`: System notifications
- `status`: Status indicators
- `table`: Table-related text
- `types`: Entity types
- `validations`: Form validation messages

## Authentication & Authorization

The application includes:
- JWT-based authentication
- Role-based access control
- Permission checking utilities
- CSRF protection
- Secure API communication

## State Management

- **Theme Store**: Theme preferences and settings
- **User Store**: User authentication and profile data
- **React Query**: Server state caching and synchronization

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Custom hooks for reusable logic

### Component Structure
```typescript
// Component template
interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
}
```

## Deployment

### Build Process
```sh
npm run build
```

### Deployment Targets
- Static hosting services (Netlify, Vercel)
- CDN deployment
- Docker containerization
- Micro-frontend integration

### Environment Variables

Create a `.env` file for local development:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=IAS Policies UI
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Support

For support and questions, please contact the development team or create an issue in the repository.
