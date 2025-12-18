
# Personal Finance App

Aplicación de finanzas personales que consume una API mockeada (Mocky) para simular operaciones reales. Gestiona dos estados principales:
- **Autenticación:** Maneja el usuario y el token de sesión.
- **Preferencias:** Permite seleccionar idioma y tema visual (claro/oscuro).

Incluye Dockerfile multi-stage y está lista para desplegarse en contenedores Docker. Se ha desplegado en una instancia EC2 de Ubuntu y está disponible en producción:

**Producción:** [http://34.236.152.99/dashboard](http://34.236.152.99/dashboard)

Contacto: daniel.zambrano@appinit.co

A continuación, la documentación original:

## 🚀 Features

### Core Features
- ✅ **User Authentication**: Secure login system with session persistence
- ✅ **Dashboard**: Overview of financial status with total income, expenses, and balance
- ✅ **Transaction Management**: Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Filtering**: Filter transactions by type and category
- ✅ **Sorting**: Sort transactions by date, amount, or title
- ✅ **Responsive Design**: Mobile-first design that works on all devices
- ✅ **Form Validation**: Comprehensive validation using Zod
- ✅ **Loading States**: User-friendly loading indicators for all async operations
- ✅ **Error Handling**: Graceful error handling with user-friendly messages

### Technical Features
- 🏗️ **Clean Architecture**: Separation of concerns with domain, application, infrastructure, and presentation layers
- 🔄 **State Management**: Redux Toolkit for authentication state
- 🌐 **API Ready**: Structured for easy integration with real backend services
- 🧪 **Unit Tests**: Comprehensive test coverage using Vitest
- 🎨 **Modern UI**: Tailwind CSS with custom blue theme
- ⚡ **Performance**: TanStack Query for efficient data fetching and caching

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager


## 🛠️ Instalación y ejecución local

1. Clona el repositorio:
	```sh
	git clone <REPO_URL>
	cd personal-finance
	```
2. Instala dependencias:
	```sh
	npm install
	```
3. Configura variables de entorno:
	- Crea un archivo `.env` o `.env.production` según corresponda.
	- Asegúrate de definir la URL de la API mocky con la variable `VITE_API_URL`.

4. Ejecuta en modo desarrollo:
	```sh
	npm run dev
	```

5. Compila para producción:
	```sh
	npm run build:prod
	```

## Dockerización

La aplicación incluye un `Dockerfile` multi-stage para construir y servir el frontend con Nginx. Puedes construir y correr el contenedor así:

```sh
docker build -t personal-finance:latest .
docker run -d -p 80:80 --name personal-finance personal-finance:latest
```

## Despliegue en EC2

La app fue desplegada en una instancia EC2 de Ubuntu. Puedes acceder a la versión en producción aquí:

[http://34.236.152.99/dashboard](http://34.236.152.99/dashboard)

## Contacto

Para dudas o soporte: daniel.zambrano@appinit.co

## 🔑 Demo Credentials

For testing purposes, you can use these credentials:

- **Email**: demo@example.com
- **Password**: password123

Or alternatively:

- **Email**: user@test.com
- **Password**: test123

## 📁 Project Structure

```
src/
├── application/           # Application layer
│   ├── hooks/            # Custom React hooks (TanStack Query)
│   └── store/            # Redux store and slices
├── domain/               # Domain layer
│   └── models/           # Domain entities and types
├── infrastructure/       # Infrastructure layer
│   ├── http/            # API client configuration
│   └── services/        # Service implementations (mocked)
├── presentation/         # Presentation layer
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   └── transactions/ # Transaction-specific components
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   └── routes/         # Route configuration
└── test/               # Test files
```

## 🏗️ Architecture

The application follows **Clean Architecture** principles:

1. **Domain Layer**: Contains business entities and types
2. **Application Layer**: Business logic, state management, and use cases
3. **Infrastructure Layer**: External services, API clients, and data sources
4. **Presentation Layer**: UI components, pages, and user interactions

### Key Design Decisions

#### State Management
- **Redux Toolkit**: Used for authentication state due to its need to be accessed globally across the application
- **TanStack Query**: Used for server state (transactions) due to its excellent caching, background refetching, and loading state management

#### Form Handling
- **React Hook Form**: Efficient form state management with minimal re-renders
- **Zod**: Type-safe schema validation for forms

#### Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Custom Blue Theme**: Extended Tailwind with custom primary colors matching the requirement

#### API Architecture
- **Mocked Services**: Current implementation uses in-memory data with simulated delays
- **Easy Backend Integration**: Services are designed to easily swap mock implementations with real API calls
- **Axios Interceptors**: Pre-configured for token management and error handling

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

### Test Coverage

The application includes unit tests for:
- UI Components (Button, Input)
- Redux Slices (Auth)
- Services (Transaction Service)
- Utility Functions

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint

## 🔐 Security Considerations

- JWT tokens stored in localStorage (in production, consider httpOnly cookies)
- Password validation (minimum 6 characters)
- Email validation
- Protected routes (authentication required)
- Automatic token validation on app load
- Automatic logout on 401 responses


