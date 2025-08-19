# Insurance Policies UI

A modern, responsive web application for managing insurance policies, built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive interface for insurance agents and administrators to manage policies, claims, payments, and renewals.

## 🌟 Features

### Core Functionality

- **Policy Management**: Create, edit, view, and cancel insurance policies
- **Claims Processing**: Submit and manage insurance claims with document uploads
- **Payment Tracking**: Mark payments as collected and manage payment documents
- **Renewal Management**: Track policies due for renewal
- **Multi-language Support**: Internationalization (i18n) with 9 languages

### User Interface

- **Responsive Design**: Mobile-first approach with modern UI components
- **Data Tables**: Advanced data tables with sorting, filtering, and pagination
- **Modal Forms**: Intuitive forms for policy creation and editing
- **Real-time Updates**: Live data updates and notifications
- **Dark/Light Theme**: Toggle between light and dark themes

### Supported Languages

- 🇺🇸 English (en)
- 🇸🇦 Arabic (ar)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇻🇳 Vietnamese (vi)
- 🇨🇳 Chinese (zh)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or bun package manager
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ias-policies-ui
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using bun
   bun install
   ```

3. **Start the development server**

   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using bun
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Common UI components
│   ├── customUI/        # Custom UI components
│   └── ui/              # Base UI components (shadcn/ui)
├── context/             # React context providers
├── functions/           # Utility functions and actions
├── hooks/               # Custom React hooks
├── interfaces/          # TypeScript interfaces
├── lib/                 # Library configurations
├── pages/               # Page components
├── services/            # API services
├── store/               # State management
└── translations/        # Internationalization files
    ├── en/              # English
    ├── ar/              # Arabic
    ├── de/              # German
    ├── es/              # Spanish
    ├── fr/              # French
    ├── ja/              # Japanese
    ├── ko/              # Korean
    ├── vi/              # Vietnamese
    └── zh/              # Chinese
```

## 🎨 UI Components

### Custom Components

- **DataTable**: Advanced data table with sorting, filtering, and pagination
- **Modal**: Reusable modal dialogs for forms and confirmations
- **SearchBox**: Intelligent search with autocomplete
- **MetricCards**: Dashboard metrics display
- **PolicyCards**: Policy information display
- **DocumentUpload**: File upload with drag & drop support

### Base Components (shadcn/ui)

- **Button**: Various button styles and variants
- **Input**: Form input fields
- **Select**: Dropdown selection components
- **Card**: Content containers
- **Dialog**: Modal dialogs
- **Table**: Data table components
- **Toast**: Notification system

## 🌐 Internationalization

The application supports multiple languages through a comprehensive translation system:

### Adding New Languages

1. Create a new folder in `src/translations/` (e.g., `it/` for Italian)
2. Copy the structure from `en/common.json`
3. Translate all values to the target language
4. Update the language configuration in `src/lib/i18n.ts`

### Translation Keys

All user-facing text is stored in translation files with organized sections:

- `common`: General UI elements
- `messages`: System messages and notifications
- `headers`: Table column headers
- `claims`: Claims-related text
- `policies`: Policy management text
- `validations`: Form validation messages

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_CSRF_TOKEN_ENDPOINT=your_csrf_endpoint
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in:

- `tailwind.config.ts` - Main configuration
- `postcss.config.js` - PostCSS configuration

### Vite Configuration

Build and development configuration in `vite.config.ts`:

- React plugin configuration
- Build optimization
- Development server settings

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for small screens with touch-friendly controls
- **Tablet**: Adaptive layouts for medium-sized screens
- **Desktop**: Full-featured interface with advanced controls

## 🎯 Key Features

### Policy Management

- Create new insurance policies
- Edit existing policy details
- Cancel policies with reason tracking
- Policy status management
- Document attachment support

### Claims System

- Submit new claims
- Upload supporting documents
- Track claim status
- Multiple claim types support

### Payment Processing

- Mark payments as collected
- Reference number tracking
- Payment document management
- Payment history

### Dashboard & Analytics

- Policy count metrics
- Premium tracking
- Renewal alerts
- Performance indicators

## 🚀 Build & Deployment

### Development Build

```bash
npm run build:dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🧪 Testing

The project includes comprehensive testing setup:

- Unit tests for components
- Integration tests for workflows
- E2E tests for critical paths

Run tests with:

```bash
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core policy management features
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced UI components and responsive design
- **v1.3.0** - Claims and payment system integration

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Vite](https://vitejs.dev/)
- Internationalization with [i18next](https://www.i18next.com/)

---

**Note**: This is a development version. For production use, ensure proper security measures, error handling, and testing are implemented.
