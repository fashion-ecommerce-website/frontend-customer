# 🛍️ Fashion E-commerce Frontend

A modern, scalable e-commerce frontend built with Next.js 15, TypeScript, and Redux Toolkit using **Self-Contained Feature Architecture**.

## ✨ Features

- 🎯 **Self-Contained Features**: Each feature is a complete, independent module
- 🔒 **Type Safety**: Full TypeScript integration with strict mode
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS + SCSS modules
- 🏪 **Redux Toolkit**: Powerful state management with Redux-Saga
- 📱 **Mobile-First**: Responsive design for all devices
- ⚡ **Performance**: Optimized for speed and SEO with Next.js 15

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Frontend-Customer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Architecture

This project follows a **Self-Contained Feature Architecture** where each feature is a complete, independent module containing all its logic, components, and styles.

### 📁 Project Structure

```
src/
├── app/                          # 🛣️ Next.js App Router
│   ├── auth/login/page.tsx      # Route: /auth/login
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
│
├── features/                     # 🎯 Self-Contained Features
│   └── auth/
│       └── login/               # Complete login module
│           ├── containers/
│           │   └── LoginContainer.tsx
│           ├── components/
│           │   └── LoginPresenter.tsx
│           ├── states/
│           │   └── LoginCallState.tsx
│           ├── redux/
│           │   ├── loginSlice.ts
│           │   └── loginSaga.ts
│           ├── types/
│           │   └── login.types.ts
│           ├── styles/
│           │   └── login.module.scss
│           └── index.ts         # Feature exports
│
├── hooks/                        # 🎣 Global Custom Hooks
│   └── redux.ts                # Typed Redux hooks
│
├── providers/                    # 🔗 Context Providers
│   └── ReduxProvider.tsx        # Redux store provider
│
├── services/                     # 🔌 External Services
│   └── api/                     # API clients
│
├── store/                        # 🏪 Global Store Configuration
│   ├── index.ts                 # Store setup
│   ├── rootReducer.ts           # Combine feature reducers
│   └── sagas/
│       └── rootSaga.ts          # Combine feature sagas
│
└── public/                       # 📁 Static Assets
    ├── images/                  # Static images
    │   ├── brand/               # Brand assets (logo, etc.)
    │   ├── products/            # Product images
    │   ├── ui/                  # UI elements (placeholders, etc.)
    │   ├── backgrounds/         # Background images
    │   └── avatars/             # User avatars
    ├── icons/                   # Favicons and app icons
    ├── fonts/                   # Static fonts (if needed)
    └── manifest.json            # PWA manifest
```

## 🎯 Self-Contained Feature Architecture

### What makes a feature "Self-Contained"?

Each feature module contains **everything** it needs to function independently:

#### **📦 Complete Independence**
- **UI Components**: All components related to the feature
- **Business Logic**: Redux slice, sagas, and state management
- **Types**: TypeScript definitions specific to the feature
- **Styles**: SCSS modules for feature-specific styling
- **API Logic**: Feature-specific API calls and data handling

#### **🔄 Feature Structure Template**
```
features/[domain]/[feature]/
├── containers/           # Smart components with business logic
├── components/           # Dumb/presentational components
├── states/              # State management components
├── redux/               # Redux slice + saga
├── types/               # TypeScript definitions
├── styles/              # SCSS modules
└── index.ts             # Barrel exports
```

### 🎨 Login Feature Example

The login feature demonstrates the self-contained approach:

```typescript
// Complete feature in one place
import { 
  LoginContainer,           // Main container
  LoginPresenter,           // UI component
  LoginCallState,           // State management
  loginReducer,             // Redux reducer
  loginSaga,                // Redux saga
  LoginFormData,            // TypeScript types
} from '@/features/auth/login';
```

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + SCSS Modules
- **State Management**: Redux Toolkit + Redux-Saga

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Build Tool**: Next.js built-in (Turbopack)

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🎯 Current Features

### ✅ Authentication System
- **Route**: `/auth/login`
- **Features**: Login/Logout with form validation
- **State**: Redux Toolkit + Redux-Saga
- **UI**: Responsive form with error handling
- **Demo**: Any email/password combination works

### 🚧 Planned Features
- User Registration (`/auth/register`)
- User Profile Management
- Product Catalog
- Shopping Cart
- Order Management

## 🧩 Adding New Features

### 1. Create Feature Structure
```bash
mkdir -p src/features/[domain]/[feature]/{containers,components,states,redux,types,styles}
touch src/features/[domain]/[feature]/index.ts
```

### 2. Implement Feature Components
```typescript
// containers/FeatureContainer.tsx
export const FeatureContainer = () => {
  // Business logic here
};

// components/FeaturePresenter.tsx  
export const FeaturePresenter = () => {
  // UI logic here
};
```

### 3. Add Redux Logic
```typescript
// redux/featureSlice.ts
export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Feature-specific actions
  },
});

// redux/featureSaga.ts
export function* featureSaga() {
  // Feature-specific side effects
}
```

### 4. Connect to Global Store
```typescript
// store/rootReducer.ts
import { featureReducer } from '../features/domain/feature';

export const rootReducer = combineReducers({
  feature: featureReducer,
});

// store/sagas/rootSaga.ts
import { featureSaga } from '../../features/domain/feature';

export function* rootSaga() {
  yield all([
    fork(featureSaga),
  ]);
}
```

## 🎨 Styling Guidelines

### SCSS Modules
Each feature has its own SCSS module:
```scss
// features/auth/login/styles/login.module.scss
.container {
  max-width: 28rem;
  margin: 0 auto;
}

.loginCard {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Tailwind CSS
Global utility classes for common styling:
```typescript
<div className="min-h-screen bg-gray-100 py-8">
  <div className="container mx-auto px-4">
    {/* Content */}
  </div>
</div>
```

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Fashion Store
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/` → `src/`
- Feature-specific type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the self-contained feature architecture
4. Write tests for your feature
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Each feature should be self-contained
- Follow TypeScript best practices
- Use SCSS modules for feature-specific styles
- Write comprehensive tests
- Update documentation

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Redux Toolkit for simplified state management
- Tailwind CSS for utility-first styling
- TypeScript for type safety
