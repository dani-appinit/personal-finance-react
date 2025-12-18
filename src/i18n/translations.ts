// Internationalization - Translations
export const translations = {
  en: {
    // Auth
    'auth.title': 'Personal Finance',
    'auth.subtitle': 'Sign in to manage your finances',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.signingIn': 'Signing In...',
    'auth.demoCredentials': 'Demo Credentials:',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.addTransaction': 'Add Transaction',
    'dashboard.transactions': 'Transactions',
    'dashboard.logout': 'Logout',
    
    // Financial Summary
    'summary.totalIncome': 'Total Income',
    'summary.totalExpenses': 'Total Expenses',
    'summary.netBalance': 'Net Balance',
    
    // Transaction List
    'transactions.title': 'Title',
    'transactions.amount': 'Amount',
    'transactions.type': 'Type',
    'transactions.category': 'Category',
    'transactions.date': 'Date',
    'transactions.actions': 'Actions',
    'transactions.noTransactions': 'No transactions',
    'transactions.getStarted': 'Get started by creating a new transaction.',
    
    // Transaction Form
    'form.title': 'Title',
    'form.titlePlaceholder': 'e.g., Monthly Salary, Grocery Shopping',
    'form.amount': 'Amount',
    'form.type': 'Type',
    'form.category': 'Category',
    'form.date': 'Date',
    'form.newTransaction': 'New Transaction',
    'form.editTransaction': 'Edit Transaction',
    'form.add': 'Add',
    'form.update': 'Update',
    'form.cancel': 'Cancel',
    'transactions.confirmDelete': 'Are you sure you want to delete this transaction?',
    'transactions.addFirst': 'Add your first transaction to get started',
    'dashboard.newTransaction': 'New Transaction',
    
    // Filters
    'filters.type': 'Type',
    'filters.category': 'Category',
    'filters.sortBy': 'Sort By',
    'filters.order': 'Order',
    'filters.allTypes': 'All Types',
    'filters.allCategories': 'All Categories',
    'filters.descending': 'Descending',
    'filters.ascending': 'Ascending',
    'filters.date': 'Date',
    'filters.amount': 'Amount',
    'filters.title': 'Title',
    
    // Transaction Types
    'types.income': 'Income',
    'types.expense': 'Expense',
    
    // Categories
    'categories.salary': 'Salary',
    'categories.freelance': 'Freelance',
    'categories.investment': 'Investment',
    'categories.food': 'Food',
    'categories.transport': 'Transport',
    'categories.entertainment': 'Entertainment',
    'categories.utilities': 'Utilities',
    'categories.healthcare': 'Healthcare',
    'categories.shopping': 'Shopping',
    'categories.other': 'Other',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.themeColor': 'Theme Color',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.blue': 'Blue',
    'settings.purple': 'Purple',
    'settings.green': 'Green',
  },
  es: {
    // Auth
    'auth.title': 'Finanzas Personales',
    'auth.subtitle': 'Inicia sesión para gestionar tus finanzas',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.signIn': 'Iniciar sesión',
    'auth.signingIn': 'Iniciando sesión...',
    'auth.demoCredentials': 'Credenciales de demostración:',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.addTransaction': 'Agregar transacción',
    'dashboard.transactions': 'Transacciones',
    'dashboard.logout': 'Cerrar sesión',
    
    // Financial Summary
    'summary.totalIncome': 'Ingresos totales',
    'summary.totalExpenses': 'Gastos totales',
    'summary.netBalance': 'Balance neto',
    
    // Transaction List
    'transactions.title': 'Título',
    'transactions.amount': 'Monto',
    'transactions.type': 'Tipo',
    'transactions.category': 'Categoría',
    'transactions.date': 'Fecha',
    'transactions.actions': 'Acciones',
    'transactions.noTransactions': 'Sin transacciones',
    'transactions.getStarted': 'Comienza creando una nueva transacción.',
    
    // Transaction Form
    'form.title': 'Título',
    'form.titlePlaceholder': 'ej., Salario mensual, Compra de supermercado',
    'form.amount': 'Monto',
    'form.type': 'Tipo',
    'form.category': 'Categoría',
    'form.date': 'Fecha',
    'form.newTransaction': 'Nueva transacción',
    'form.editTransaction': 'Editar transacción',
    'form.add': 'Agregar',
    'form.update': 'Actualizar',
    'form.cancel': 'Cancelar',
    'transactions.confirmDelete': '¿Estás seguro de que deseas eliminar esta transacción?',
    'transactions.addFirst': 'Agrega tu primera transacción para comenzar',
    'dashboard.newTransaction': 'Nueva transacción',
    
    // Filters
    'filters.type': 'Tipo',
    'filters.category': 'Categoría',
    'filters.sortBy': 'Ordenar por',
    'filters.order': 'Orden',
    'filters.allTypes': 'Todos los tipos',
    'filters.allCategories': 'Todas las categorías',
    'filters.descending': 'Descendente',
    'filters.ascending': 'Ascendente',
    'filters.date': 'Fecha',
    'filters.amount': 'Monto',
    'filters.title': 'Título',
    
    // Transaction Types
    'types.income': 'Ingreso',
    'types.expense': 'Gasto',
    
    // Categories
    'categories.salary': 'Salario',
    'categories.freelance': 'Trabajo independiente',
    'categories.investment': 'Inversión',
    'categories.food': 'Comida',
    'categories.transport': 'Transporte',
    'categories.entertainment': 'Entretenimiento',
    'categories.utilities': 'Servicios',
    'categories.healthcare': 'Salud',
    'categories.shopping': 'Compras',
    'categories.other': 'Otro',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.themeColor': 'Color del tema',
    'settings.light': 'Claro',
    'settings.dark': 'Oscuro',
    'settings.blue': 'Azul',
    'settings.purple': 'Morado',
    'settings.green': 'Verde',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const useTranslation = (language: 'en' | 'es') => {
  return (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
};
