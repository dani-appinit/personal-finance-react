


# Personal Finance App

Aplicación de finanzas personales que consume una API mockeada (Mocky) para simular operaciones reales. Gestiona dos estados principales:
- **Autenticación:** Maneja el usuario y el token de sesión.
- **Preferencias:** Permite seleccionar idioma y tema visual (claro/oscuro).
- **Iniciar proyecto:** Ejecutar npm install y posteriormente npm run dev.

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


