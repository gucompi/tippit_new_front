/**
 * Strapi Seed Script - Works with Strapi's actual structure
 * Creates content types with fields and seeds data
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://strapi-tippit-u63628.vm.elestio.app';
const STRAPI_TOKEN = process.env.STRAPI_API_KEY || '4782a39b0872850ac4e89df9e6e7874233751e5c98da64587e83181d4ee408930abd95d92c3cb0afaece2a322e17b0fa669c84638c2f1ab460a8f885dc21211e9673119b4550b27c11819497c2bc51d33f666ecd33e626026348f456ac664500506b762dc7670a2e5f7760424c7efbcb1fe6c526247ceebc0ae62f0822c73fea';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_TOKEN}`,
};

// Load schemas
const menuItemSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'menu-item/schema.json'), 'utf-8')
);
const translationSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'translation/schema.json'), 'utf-8')
);

// Get content type schema from Strapi
async function getContentTypeSchema(pluralName: string) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/content-type-builder/content-types`,
      { headers }
    );
    const contentTypes = response.data?.data || [];
    const ct = contentTypes.find((c: any) => 
      c.schema?.pluralName === pluralName || 
      c.apiID === pluralName.replace('-', '') ||
      c.uid?.includes(pluralName.replace('-', '_'))
    );
    return ct?.schema || null;
  } catch (error) {
    return null;
  }
}


const menuItemsData = [
  { key: 'dashboard', label: 'Home', labelEs: 'Inicio', path: '/dashboard', icon: 'Home', order: 1, enabled: true, roles: ['Manager', 'Restaurante', 'Mozo'] },
  { key: 'business', label: 'My Restaurant', labelEs: 'Mi Restaurante', path: '/business', icon: 'BarChart3', order: 2, enabled: true, roles: ['Duenio', 'Manager'] },
  { key: 'shift', label: 'Shift Record', labelEs: 'Registro de Turno', path: '/shift', icon: 'Clock', order: 3, enabled: true, roles: ['Manager', 'Restaurante'] },
  { key: 'giftcards', label: 'Gift Cards', labelEs: 'Tarjetas de Regalo', path: '/giftcards', icon: 'CreditCard', order: 4, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio'] },
  { key: 'qrs', label: 'My QR Codes', labelEs: 'Mis Códigos QR', path: '/qrs', icon: 'QrCode', order: 5, enabled: true, roles: ['Manager', 'Restaurante'] },
  { key: 'staff', label: 'My Staff', labelEs: 'Mi Personal', path: '/staff', icon: 'Users', order: 6, enabled: true, roles: ['Manager', 'Restaurante'] },
  { key: 'profile', label: 'View My Profile', labelEs: 'Ver Mi Perfil', path: '/profile', icon: 'User', order: 7, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
  { key: 'notifications', label: 'Notifications', labelEs: 'Notificaciones', path: '/notifications', icon: 'Bell', order: 8, enabled: true, roles: ['Manager', 'Restaurante', 'Duenio', 'Mozo'] },
];

const translationsData = [
  { namespace: 'common', key: 'loading', value: 'Loading...', valueEs: 'Cargando...' },
  { namespace: 'common', key: 'error', value: 'An error occurred', valueEs: 'Ocurrió un error' },
  { namespace: 'common', key: 'retry', value: 'Retry', valueEs: 'Reintentar' },
  { namespace: 'common', key: 'save', value: 'Save', valueEs: 'Guardar' },
  { namespace: 'common', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'common', key: 'delete', value: 'Delete', valueEs: 'Eliminar' },
  { namespace: 'common', key: 'edit', value: 'Edit', valueEs: 'Editar' },
  { namespace: 'common', key: 'back', value: 'Back', valueEs: 'Volver' },
  { namespace: 'common', key: 'next', value: 'Next', valueEs: 'Siguiente' },
  { namespace: 'common', key: 'submit', value: 'Submit', valueEs: 'Enviar' },
  { namespace: 'common', key: 'refresh', value: 'Refresh', valueEs: 'Actualizar' },
  { namespace: 'common', key: 'version', value: 'v2.0.0', valueEs: 'v2.0.0' },
  { namespace: 'auth.login', key: 'title', value: 'Hi, business owner!', valueEs: '¡Hola, dueño de negocio!' },
  { namespace: 'auth.login', key: 'titleWorker', value: 'Hi, team member!', valueEs: '¡Hola, miembro del equipo!' },
  { namespace: 'auth.login', key: 'toggleOwner', value: 'Actually I am a business owner', valueEs: 'En realidad soy dueño de negocio' },
  { namespace: 'auth.login', key: 'toggleWorker', value: 'Actually I am a team member', valueEs: 'En realidad soy miembro del equipo' },
  { namespace: 'auth.login', key: 'email', value: 'Email', valueEs: 'Correo electrónico' },
  { namespace: 'auth.login', key: 'emailPlaceholder', value: 'Enter your email', valueEs: 'Ingresa tu correo' },
  { namespace: 'auth.login', key: 'password', value: 'Password', valueEs: 'Contraseña' },
  { namespace: 'auth.login', key: 'passwordPlaceholder', value: 'Enter your password', valueEs: 'Ingresa tu contraseña' },
  { namespace: 'auth.login', key: 'forgotPassword', value: 'Forgot password?', valueEs: '¿Olvidaste tu contraseña?' },
  { namespace: 'auth.login', key: 'or', value: 'or', valueEs: 'o' },
  { namespace: 'auth.login', key: 'signInWithGoogle', value: 'Sign in with Google', valueEs: 'Iniciar sesión con Google' },
  { namespace: 'auth.login', key: 'submit', value: 'Enter', valueEs: 'Entrar' },
  { namespace: 'auth.login', key: 'submitting', value: 'Signing in...', valueEs: 'Iniciando sesión...' },
  { namespace: 'auth.login', key: 'createAccount', value: "Don't have an account yet?", valueEs: '¿Aún no tienes cuenta?' },
  { namespace: 'auth.login', key: 'createAccountLink', value: 'Create one', valueEs: 'Crear una' },
  { namespace: 'auth.login', key: 'errors.emailRequired', value: 'Email is required', valueEs: 'El correo es obligatorio' },
  { namespace: 'auth.login', key: 'errors.emailInvalid', value: 'Please enter a valid email', valueEs: 'Ingresa un correo válido' },
  { namespace: 'auth.login', key: 'errors.passwordRequired', value: 'Password is required', valueEs: 'La contraseña es obligatoria' },
  { namespace: 'auth.login', key: 'errors.passwordMin', value: 'Password must be at least 6 characters', valueEs: 'La contraseña debe tener al menos 6 caracteres' },
  { namespace: 'auth.forgotPassword', key: 'title', value: 'Forgot your password?', valueEs: '¿Olvidaste tu contraseña?' },
  { namespace: 'auth.forgotPassword', key: 'description', value: "Enter your email address and we'll send you a link to reset your password.", valueEs: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.' },
  { namespace: 'auth.forgotPassword', key: 'submit', value: 'Send Reset Link', valueEs: 'Enviar enlace' },
  { namespace: 'auth.forgotPassword', key: 'submitting', value: 'Sending...', valueEs: 'Enviando...' },
  { namespace: 'auth.forgotPassword', key: 'backToLogin', value: 'Back to login', valueEs: 'Volver al inicio' },
  { namespace: 'auth.forgotPassword', key: 'success', value: 'Password reset link sent to your email.', valueEs: 'Se envió el enlace de restablecimiento a tu correo.' },
  { namespace: 'auth', key: 'logout', value: 'Logout', valueEs: 'Cerrar sesión' },
  { namespace: 'menu', key: 'title', value: 'Menu', valueEs: 'Menú' },
  { namespace: 'menu', key: 'session', value: 'Session: {role}', valueEs: 'Sesión: {role}' },
  { namespace: 'business.pageHeader', key: 'title', value: 'My Restaurant', valueEs: 'Mi Restaurante' },
  { namespace: 'business.pageHeader', key: 'tooltip', value: "View your restaurant's performance metrics, including total tips, active QR codes, and staff rankings.", valueEs: 'Ve las métricas de rendimiento de tu restaurante, incluyendo propinas totales, códigos QR activos y rankings del personal.' },
  { namespace: 'business.filters', key: 'last30Days', value: 'Last 30 days', valueEs: 'Últimos 30 días' },
  { namespace: 'business.filters', key: 'last3Months', value: 'Last 3 months', valueEs: 'Últimos 3 meses' },
  { namespace: 'business.filters', key: 'last6Months', value: 'Last 6 months', valueEs: 'Últimos 6 meses' },
  { namespace: 'business.filters', key: 'lastYear', value: 'Last year', valueEs: 'Último año' },
  { namespace: 'business.stats', key: 'totalTips', value: 'Total Tips', valueEs: 'Propinas Totales' },
  { namespace: 'business.stats', key: 'qrCodes', value: 'QR Codes', valueEs: 'Códigos QR' },
  { namespace: 'business.stats', key: 'activeQRs', value: 'Active QR codes', valueEs: 'QRs activos' },
  { namespace: 'business.stats', key: 'tips', value: 'Tips', valueEs: 'Propinas' },
  { namespace: 'business.stats', key: 'receivedTips', value: 'Received tips', valueEs: 'Propinas recibidas' },
  { namespace: 'business.stats', key: 'service', value: 'Service', valueEs: 'Servicio' },
  { namespace: 'business.stats', key: 'averageRating', value: 'Average rating', valueEs: 'Calificación promedio' },
  { namespace: 'business.rankings', key: 'bestPerformance', value: 'Best Performance', valueEs: 'Mejor Rendimiento' },
  { namespace: 'business.rankings', key: 'bestTips', value: 'Best Tips', valueEs: 'Mejores Propinas' },
  { namespace: 'business.rankings', key: 'noData', value: 'No data available for this period', valueEs: 'No hay datos disponibles para este período' },
  { namespace: 'notifications', key: 'title', value: 'Notifications', valueEs: 'Notificaciones' },
  { namespace: 'notifications', key: 'empty', value: 'No notifications', valueEs: 'Sin notificaciones' },
  { namespace: 'profile', key: 'title', value: 'My Profile', valueEs: 'Mi Perfil' },
  
  // Register - Step 1 (Credentials)
  { namespace: 'register.step1', key: 'fullName', value: 'Full Name', valueEs: 'Nombre Completo' },
  { namespace: 'register.step1', key: 'fullNamePlaceholder', value: 'Enter your full name', valueEs: 'Ingresa tu nombre completo' },
  { namespace: 'register.step1', key: 'email', value: 'Email', valueEs: 'Correo electrónico' },
  { namespace: 'register.step1', key: 'emailPlaceholder', value: 'Enter your email', valueEs: 'Ingresa tu correo' },
  { namespace: 'register.step1', key: 'password', value: 'Password (minimum 8 characters)', valueEs: 'Contraseña (mínimo 8 caracteres)' },
  { namespace: 'register.step1', key: 'passwordPlaceholder', value: 'Enter your password', valueEs: 'Ingresa tu contraseña' },
  { namespace: 'register.step1', key: 'showPassword', value: 'Show password', valueEs: 'Mostrar contraseña' },
  { namespace: 'register.step1', key: 'hidePassword', value: 'Hide password', valueEs: 'Ocultar contraseña' },
  { namespace: 'register.step1', key: 'errors.nameRequired', value: 'Name is required', valueEs: 'El nombre es obligatorio' },
  { namespace: 'register.step1', key: 'errors.emailRequired', value: 'Email is required', valueEs: 'El correo es obligatorio' },
  { namespace: 'register.step1', key: 'errors.emailInvalid', value: 'Please enter a valid email', valueEs: 'Ingresa un correo válido' },
  { namespace: 'register.step1', key: 'errors.emailExists', value: 'This email is already registered', valueEs: 'Este correo ya está registrado' },
  { namespace: 'register.step1', key: 'errors.passwordRequired', value: 'Password is required', valueEs: 'La contraseña es obligatoria' },
  { namespace: 'register.step1', key: 'errors.passwordMin', value: 'Password must be at least 8 characters', valueEs: 'La contraseña debe tener al menos 8 caracteres' },
  { namespace: 'register.step1', key: 'or', value: 'or', valueEs: 'o' },
  { namespace: 'register.step1', key: 'signUpWithGoogle', value: 'Sign up with Google', valueEs: 'Registrarse con Google' },
  
  // Register - Step 2 (Details)
  { namespace: 'register.step2', key: 'cuit', value: 'CUIT (Tax ID)', valueEs: 'CUIT (Identificación Fiscal)' },
  { namespace: 'register.step2', key: 'cuitPlaceholder', value: 'Enter your CUIT (11 digits)', valueEs: 'Ingresa tu CUIT (11 dígitos)' },
  { namespace: 'register.step2', key: 'alias', value: 'Payment Alias', valueEs: 'Alias de Pago' },
  { namespace: 'register.step2', key: 'aliasPlaceholder', value: 'Enter your payment alias (e.g. john.doe.mp)', valueEs: 'Ingresa tu alias de pago (ej. juan.perez.mp)' },
  { namespace: 'register.step2', key: 'phonePlaceholder', value: '11 5555 6666', valueEs: '11 5555 6666' },
  { namespace: 'register.step2', key: 'phone', value: 'Phone Number', valueEs: 'Número de Teléfono' },
  { namespace: 'register.step2', key: 'phonePlaceholder', value: 'Enter your phone number', valueEs: 'Ingresa tu número de teléfono' },
  { namespace: 'register.step2', key: 'errors.cuitRequired', value: 'CUIT is required', valueEs: 'El CUIT es obligatorio' },
  { namespace: 'register.step2', key: 'errors.cuitInvalid', value: 'CUIT must be 11 digits', valueEs: 'El CUIT debe tener 11 dígitos' },
  { namespace: 'register.step2', key: 'errors.cuitExists', value: 'This CUIT is already registered', valueEs: 'Este CUIT ya está registrado' },
  { namespace: 'register.step2', key: 'errors.aliasRequired', value: 'Alias is required', valueEs: 'El alias es obligatorio' },
  { namespace: 'register.step2', key: 'errors.phoneRequired', value: 'Phone number is required', valueEs: 'El número de teléfono es obligatorio' },
  { namespace: 'register.step2', key: 'errors.phoneInvalid', value: 'Please enter a valid phone number', valueEs: 'Ingresa un número de teléfono válido' },
  { namespace: 'register.step2', key: 'errors.phoneExists', value: 'This phone number is already registered', valueEs: 'Este número de teléfono ya está registrado' },
  
  // Register - Step 3 (Photo)
  { namespace: 'register.step3', key: 'profilePhoto', value: 'Profile Photo', valueEs: 'Foto de Perfil' },
  { namespace: 'register.step3', key: 'uploadPhoto', value: 'Select from device', valueEs: 'Seleccionar del dispositivo' },
  { namespace: 'register.step3', key: 'takePhoto', value: 'Open Camera', valueEs: 'Abrir Cámara' },
  { namespace: 'register.step3', key: 'capturePhoto', value: 'Capture Photo', valueEs: 'Capturar Foto' },
  { namespace: 'register.step3', key: 'cameraStarting', value: 'Starting camera...', valueEs: 'Iniciando cámara...' },
  { namespace: 'register.step3', key: 'cameraError', value: 'Camera access denied or unavailable', valueEs: 'Acceso a la cámara denegado o no disponible' },
  { namespace: 'register.step3', key: 'dragDrop', value: 'Drag and drop an image here, or click to select', valueEs: 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar' },
  { namespace: 'register.step3', key: 'photoRequired', value: 'Profile photo is required', valueEs: 'La foto de perfil es obligatoria' },
  
  // Register - General
  { namespace: 'register', key: 'title', value: 'Create Account', valueEs: 'Crear Cuenta' },
  { namespace: 'register', key: 'stepIndicator', value: 'Step {current} of {total}', valueEs: 'Paso {current} de {total}' },
  { namespace: 'register', key: 'next', value: 'Next', valueEs: 'Siguiente' },
  { namespace: 'register', key: 'back', value: 'Back', valueEs: 'Atrás' },
  { namespace: 'register', key: 'submit', value: 'Create Account', valueEs: 'Crear Cuenta' },
  { namespace: 'register', key: 'submitting', value: 'Creating account...', valueEs: 'Creando cuenta...' },
  { namespace: 'register', key: 'alreadyHaveAccount', value: 'Already have an account?', valueEs: '¿Ya tienes una cuenta?' },
  { namespace: 'register', key: 'loginLink', value: 'Log in', valueEs: 'Iniciar sesión' },
  
  // Register - Success
  { namespace: 'register.success', key: 'title', value: 'Registration Successful!', valueEs: '¡Registro Exitoso!' },
  { namespace: 'register.success', key: 'emailSent', value: "We've sent a verification email to", valueEs: 'Hemos enviado un correo de verificación a' },
  { namespace: 'register.success', key: 'checkInbox', value: 'Please check your inbox and click the link to verify your account.', valueEs: 'Por favor revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.' },
  { namespace: 'register.success', key: 'resendEmail', value: 'Resend Email', valueEs: 'Reenviar Correo' },
  { namespace: 'register.success', key: 'resending', value: 'Sending...', valueEs: 'Enviando...' },
  { namespace: 'register.success', key: 'emailSentSuccess', value: 'Email Sent!', valueEs: '¡Correo Enviado!' },
  { namespace: 'register.success', key: 'goToLogin', value: 'Go to Login', valueEs: 'Ir al Inicio de Sesión' },
  { namespace: 'register.success', key: 'didntReceive', value: "Didn't receive the email?", valueEs: '¿No recibiste el correo?' },
  { namespace: 'register.success', key: 'clickToResend', value: 'Click here to resend', valueEs: 'Haz clic aquí para reenviar' },
  
  // Language Switcher
  { namespace: 'language', key: 'changeLanguage', value: 'Change language', valueEs: 'Cambiar idioma' },
  
  // Profile / My Profile
  { namespace: 'profile', key: 'title', value: 'My Profile', valueEs: 'Mi Perfil' },
  { namespace: 'profile', key: 'tooltip', value: 'View and edit your personal information, including name, email, photo, and role details.', valueEs: 'Ver y editar tu información personal, incluyendo nombre, correo, foto y detalles del rol.' },
  { namespace: 'profile', key: 'editProfile', value: 'Edit Profile', valueEs: 'Editar Perfil' },
  { namespace: 'profile', key: 'saveChanges', value: 'Save Changes', valueEs: 'Guardar Cambios' },
  { namespace: 'profile', key: 'personalInformation', value: 'Personal Information', valueEs: 'Información Personal' },
  { namespace: 'profile', key: 'name', value: 'Name', valueEs: 'Nombre' },
  { namespace: 'profile', key: 'email', value: 'Email', valueEs: 'Correo electrónico' },
  { namespace: 'profile', key: 'cuit', value: 'CUIT', valueEs: 'CUIT' },
  { namespace: 'profile', key: 'address', value: 'Address', valueEs: 'Dirección' },
  { namespace: 'profile', key: 'alias', value: 'Payment Alias', valueEs: 'Alias de Pago' },
  { namespace: 'profile', key: 'role', value: 'Role', valueEs: 'Rol' },
  { namespace: 'profile', key: 'admin', value: 'Admin', valueEs: 'Administrador' },
  { namespace: 'profile', key: 'employee', value: 'Employee', valueEs: 'Empleado' },
  { namespace: 'profile', key: 'business', value: 'Business', valueEs: 'Negocio' },
  
  // Profile - Mozo Stats
  { namespace: 'profile.mozo', key: 'totalTipsAmount', value: 'Total Tips Amount', valueEs: 'Total de Propinas' },
  { namespace: 'profile.mozo', key: 'last7Days', value: 'Last 7 days', valueEs: 'Últimos 7 días' },
  { namespace: 'profile.mozo', key: 'averageRating', value: 'Average Rating', valueEs: 'Calificación Promedio' },
  { namespace: 'profile.mozo', key: 'weeklyReviews', value: 'Weekly reviews', valueEs: 'Reseñas semanales' },
  { namespace: 'profile.mozo', key: 'attendedTables', value: 'Attended Tables', valueEs: 'Mesas Atendidas' },
  { namespace: 'profile.mozo', key: 'thisWeek', value: 'This week', valueEs: 'Esta semana' },
  
  // Profile - Staff Management Modal
  { namespace: 'profile.staff', key: 'addStaffToRestaurant', value: 'Add Staff to Restaurant', valueEs: 'Agregar Personal al Restaurante' },
  { namespace: 'profile.staff', key: 'cuitLabel', value: 'CUIT:', valueEs: 'CUIT:' },
  { namespace: 'profile.staff', key: 'chooseRole', value: 'Choose a role', valueEs: 'Elegir un rol' },
  { namespace: 'profile.staff', key: 'add', value: 'Add', valueEs: 'Agregar' },
  { namespace: 'profile.staff', key: 'delete', value: 'Delete', valueEs: 'Eliminar' },
  { namespace: 'profile.staff', key: 'noDataAvailable', value: 'No data available', valueEs: 'No hay datos disponibles' },
  { namespace: 'profile.staff', key: 'errorMessage', value: 'Please fill in all fields', valueEs: 'Por favor complete todos los campos' },
  { namespace: 'profile.staff', key: 'successMessage', value: 'Staff member added successfully', valueEs: 'Personal agregado exitosamente' },
  { namespace: 'profile.staff', key: 'successMessageDelete', value: 'Staff member removed successfully', valueEs: 'Personal eliminado exitosamente' },
  { namespace: 'profile.staff', key: 'networkErrorMessage', value: 'Network error. Please try again.', valueEs: 'Error de red. Por favor intente nuevamente.' },
  
  // Photo Component
  { namespace: 'photo', key: 'takeSelfie', value: 'Take a selfie', valueEs: 'Tomar una selfie' },
  { namespace: 'photo', key: 'captured', value: 'Captured photo', valueEs: 'Foto capturada' },
  { namespace: 'photo', key: 'uploadImage', value: 'Upload Image', valueEs: 'Subir Imagen' },
  { namespace: 'photo', key: 'uploadAnotherImage', value: 'Upload Another Image', valueEs: 'Subir Otra Imagen' },
  
  // Gift Cards
  { namespace: 'giftCards', key: 'mainTitle', value: 'Gift Cards', valueEs: 'Tarjetas de Regalo' },
  { namespace: 'giftCards', key: 'pageHeaderTooltip', value: 'Manage and create gift cards for your customers', valueEs: 'Gestiona y crea tarjetas de regalo para tus clientes' },
  { namespace: 'giftCards', key: 'giftCards', value: 'Gift Cards', valueEs: 'Tarjetas de Regalo' },
  { namespace: 'giftCards', key: 'validate', value: 'Validate', valueEs: 'Validar' },
  { namespace: 'giftCards', key: 'create', value: 'Create Gift Card', valueEs: 'Crear Tarjeta de Regalo' },
  { namespace: 'giftCards', key: 'used', value: 'Used', valueEs: 'Usada' },
  { namespace: 'giftCards', key: 'expired', value: 'Expired', valueEs: 'Vencida' },
  { namespace: 'giftCards', key: 'active', value: 'Active', valueEs: 'Activa' },
  { namespace: 'giftCards', key: 'codeLabelCard', value: 'Code', valueEs: 'Código' },
  { namespace: 'giftCards', key: 'phoneLabel', value: 'Phone', valueEs: 'Teléfono' },
  { namespace: 'giftCards', key: 'emailLabel', value: 'Email', valueEs: 'Correo' },
  { namespace: 'giftCards', key: 'descriptionLabel', value: 'Description', valueEs: 'Descripción' },
  { namespace: 'giftCards', key: 'expiresOnPrefix', value: 'Expires', valueEs: 'Vence' },
  { namespace: 'giftCards', key: 'copyCode', value: 'Copy code', valueEs: 'Copiar código' },
  { namespace: 'giftCards', key: 'copyPhone', value: 'Copy phone', valueEs: 'Copiar teléfono' },
  { namespace: 'giftCards', key: 'copyEmail', value: 'Copy email', valueEs: 'Copiar correo' },
  { namespace: 'giftCards', key: 'copied', value: 'Copied!', valueEs: '¡Copiado!' },
  { namespace: 'giftCards', key: 'resend', value: 'Resend', valueEs: 'Reenviar' },
  { namespace: 'giftCards', key: 'download', value: 'Download', valueEs: 'Descargar' },
  { namespace: 'giftCards', key: 'createGiftCardModalTitle', value: 'Create Gift Card', valueEs: 'Crear Tarjeta de Regalo' },
  { namespace: 'giftCards', key: 'namePlaceholder', value: 'Name and Last Name', valueEs: 'Nombre y Apellido' },
  { namespace: 'giftCards', key: 'emailPlaceholder', value: 'Email', valueEs: 'Correo electrónico' },
  { namespace: 'giftCards', key: 'phone', value: 'Phone', valueEs: 'Teléfono' },
  { namespace: 'giftCards', key: 'phonePlaceholder', value: 'Enter phone number', valueEs: 'Ingresa número de teléfono' },
  { namespace: 'giftCards', key: 'phoneSuggestion', value: 'We recommend adding a phone number', valueEs: 'Recomendamos agregar un número de teléfono' },
  { namespace: 'giftCards', key: 'typeAndAmount', value: 'Type and Amount', valueEs: 'Tipo y Monto' },
  { namespace: 'giftCards', key: 'percentage', value: 'Percentage', valueEs: 'Porcentaje' },
  { namespace: 'giftCards', key: 'fixedAmount', value: 'Fixed Amount', valueEs: 'Monto fijo' },
  { namespace: 'giftCards', key: 'custom', value: 'Custom', valueEs: 'Personalizado' },
  { namespace: 'giftCards', key: 'writeCustomText', value: 'Write custom text', valueEs: 'Escribe texto personalizado' },
  { namespace: 'giftCards', key: 'writeOnlyNumbers', value: 'Write only numbers', valueEs: 'Escribe solo números' },
  { namespace: 'giftCards', key: 'description', value: 'Description', valueEs: 'Descripción' },
  { namespace: 'giftCards', key: 'expirationDate', value: 'Expiration Date', valueEs: 'Fecha de Vencimiento' },
  { namespace: 'giftCards', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'giftCards', key: 'createCard', value: 'Create Card', valueEs: 'Crear Tarjeta' },
  { namespace: 'giftCards', key: 'validateGiftCardModalTitle', value: 'Validate Gift Card', valueEs: 'Validar Tarjeta de Regalo' },
  { namespace: 'giftCards', key: 'enterCode', value: 'Enter Gift Card Code', valueEs: 'Ingresa el Código de la Tarjeta' },
  { namespace: 'giftCards', key: 'codePlaceholder', value: 'GC001', valueEs: 'GC001' },
  { namespace: 'giftCards', key: 'validateButton', value: 'Validate', valueEs: 'Validar' },
  { namespace: 'giftCards', key: 'markAsUsed', value: 'Mark as Used', valueEs: 'Marcar como Usada' },
  { namespace: 'giftCards', key: 'successTitle', value: 'Success!', valueEs: '¡Éxito!' },
  { namespace: 'giftCards', key: 'successMessage', value: 'Gift card created successfully', valueEs: 'Tarjeta de regalo creada exitosamente' },
  { namespace: 'giftCards', key: 'accept', value: 'Accept', valueEs: 'Aceptar' },
  { namespace: 'giftCards', key: 'filterBy', value: 'Filter by', valueEs: 'Filtrar por' },
  { namespace: 'giftCards', key: 'tabs.giftCards', value: 'Gift Cards', valueEs: 'Tarjetas de Regalo' },
  { namespace: 'giftCards', key: 'tabs.clients', value: 'Clients', valueEs: 'Clientes' },
  { namespace: 'giftCards', key: 'tabs.statistics', value: 'Statistics', valueEs: 'Estadísticas' },
  { namespace: 'giftCards', key: 'tabs.campaigns', value: 'Campaigns', valueEs: 'Campañas' },
  { namespace: 'giftCards', key: 'clientsTable.searchPlaceholder', value: 'Search clients...', valueEs: 'Buscar clientes...' },
  { namespace: 'giftCards', key: 'clientsTable.columns.client', value: 'Client', valueEs: 'Cliente' },
  { namespace: 'giftCards', key: 'clientsTable.columns.total', value: 'Total', valueEs: 'Total' },
  { namespace: 'giftCards', key: 'clientsTable.columns.used', value: 'Used', valueEs: 'Usadas' },
  { namespace: 'giftCards', key: 'clientsTable.columns.expired', value: 'Expired', valueEs: 'Vencidas' },
  { namespace: 'giftCards', key: 'clientsTable.columns.active', value: 'Active', valueEs: 'Activas' },
  { namespace: 'giftCards', key: 'clientsTable.loading', value: 'Loading...', valueEs: 'Cargando...' },
  { namespace: 'giftCards', key: 'clientsTable.empty', value: 'No clients found', valueEs: 'No se encontraron clientes' },
  { namespace: 'giftCards', key: 'clientsTable.showing', value: 'Showing {current} of {total}', valueEs: 'Mostrando {current} de {total}' },
  { namespace: 'giftCards', key: 'clientsTable.showAll', value: 'Show All', valueEs: 'Mostrar Todo' },
  { namespace: 'giftCards', key: 'clientsTable.showLess', value: 'Show Less', valueEs: 'Mostrar Menos' },
  { namespace: 'giftCards', key: 'clientsTable.sortAZ', value: 'Sort A-Z', valueEs: 'Ordenar A-Z' },
  { namespace: 'giftCards', key: 'clientsTable.sortZA', value: 'Sort Z-A', valueEs: 'Ordenar Z-A' },
  { namespace: 'giftCards', key: 'statistics.quantityGiftCards', value: 'Quantity of Gift Cards', valueEs: 'Cantidad de Tarjetas de Regalo' },
  { namespace: 'giftCards', key: 'statistics.moneyInGiftCards', value: 'Money in Gift Cards', valueEs: 'Dinero en Tarjetas de Regalo' },
  { namespace: 'giftCards', key: 'statistics.clientsUsingGiftCard', value: 'Clients Using Gift Card', valueEs: 'Clientes Usando Tarjeta de Regalo' },
  { namespace: 'giftCards', key: 'statistics.negativeReviews', value: 'Negative Reviews', valueEs: 'Reseñas Negativas' },
  { namespace: 'giftCards', key: 'statistics.newClientsByGiftCard', value: 'New Clients by Gift Card', valueEs: 'Nuevos Clientes por Tarjeta de Regalo' },
  { namespace: 'giftCards', key: 'statisticsComingSoon.title', value: 'Statistics Coming Soon', valueEs: 'Estadísticas Próximamente' },
  { namespace: 'giftCards', key: 'statisticsComingSoon.description', value: 'Detailed statistics will be available soon', valueEs: 'Las estadísticas detalladas estarán disponibles pronto' },
  { namespace: 'giftCards', key: 'campaignsComingSoon.title', value: 'Campaigns Coming Soon', valueEs: 'Campañas Próximamente' },
  { namespace: 'giftCards', key: 'campaignsComingSoon.description', value: 'Gift card campaigns feature will be available soon', valueEs: 'La función de campañas de tarjetas de regalo estará disponible pronto' },
  { namespace: 'giftCards', key: 'campaignsComingSoon.cta', value: 'Stay tuned for updates!', valueEs: '¡Mantente atento a las actualizaciones!' },
  
  // Notifications translations
  { namespace: 'notifications', key: 'title', value: 'Notifications', valueEs: 'Notificaciones' },
  { namespace: 'notifications', key: 'pageHeaderTooltip', value: 'Review all your notifications, system alerts, received tips and important updates about your business.', valueEs: 'Revisa todas tus notificaciones, alertas del sistema, propinas recibidas y actualizaciones importantes sobre tu negocio.' },
  { namespace: 'notifications', key: 'markAllRead', value: 'Mark all as read', valueEs: 'Marcar todas como leídas' },
  { namespace: 'notifications', key: 'all', value: 'All', valueEs: 'Todas' },
  { namespace: 'notifications', key: 'unread', value: 'Unread', valueEs: 'No leídas' },
  { namespace: 'notifications', key: 'read', value: 'Read', valueEs: 'Leídas' },
  { namespace: 'notifications', key: 'noNotifications', value: 'You have no notifications', valueEs: 'No tienes notificaciones' },
  { namespace: 'notifications', key: 'noUnread', value: 'You have no unread notifications', valueEs: 'No tienes notificaciones no leídas' },
  { namespace: 'notifications', key: 'noRead', value: 'You have no read notifications', valueEs: 'No tienes notificaciones leídas' },
  { namespace: 'notifications', key: 'loading', value: 'Loading notifications...', valueEs: 'Cargando notificaciones...' },
  { namespace: 'notifications', key: 'justNow', value: 'Just now', valueEs: 'Ahora mismo' },
  { namespace: 'notifications', key: 'hoursAgo', value: '{{count}} hours ago', valueEs: 'Hace {{count}} horas' },
  { namespace: 'notifications', key: 'yesterday', value: 'Yesterday', valueEs: 'Ayer' },
  { namespace: 'notifications', key: 'showing', value: 'Showing', valueEs: 'Mostrando' },
  { namespace: 'notifications', key: 'of', value: 'of', valueEs: 'de' },
  { namespace: 'notifications', key: 'previous', value: 'Previous', valueEs: 'Anterior' },
  { namespace: 'notifications', key: 'next', value: 'Next', valueEs: 'Siguiente' },
  { namespace: 'notifications', key: 'loadError', value: 'Error loading notifications', valueEs: 'Error al cargar notificaciones' },
  { namespace: 'notifications', key: 'markReadError', value: 'Error marking as read', valueEs: 'Error al marcar como leída' },
  { namespace: 'notifications', key: 'markAllReadError', value: 'Error marking all as read', valueEs: 'Error al marcar todas como leídas' },
  { namespace: 'notifications', key: 'deleteError', value: 'Error deleting notification', valueEs: 'Error al eliminar notificación' },
  
  // QRs translations
  { namespace: 'qrs', key: 'title', value: 'My QRs', valueEs: 'Mis QRS' },
  { namespace: 'qrs', key: 'pageHeaderTooltip', value: 'Manage your QR codes for tables, activate and deactivate QRs, and control access.', valueEs: 'Gestiona los códigos QR de tu personal, activa y desactiva QRs, y controla el acceso de tus empleados al sistema.' },
  { namespace: 'qrs', key: 'description', value: 'From here, you can activate and deactivate the QRs for each of your staff.', valueEs: 'Desde acá podés activar y desactivar los QRs de cada uno de tu personal.' },
  { namespace: 'qrs', key: 'assignQR', value: 'Assign QR', valueEs: 'Asignar QR' },
  { namespace: 'qrs', key: 'selectStaff', value: 'Choose staff', valueEs: 'Elegi a un personal' },
  { namespace: 'qrs', key: 'active', value: 'Active', valueEs: 'Activo' },
  { namespace: 'qrs', key: 'inactive', value: 'Inactive', valueEs: 'Inactivo' },
  { namespace: 'qrs', key: 'reassignQR', value: 'Reassign QR', valueEs: 'Reasignar QR' },
  { namespace: 'qrs', key: 'tag', value: 'Tag', valueEs: 'Tag' },
  { namespace: 'qrs', key: 'table', value: 'Table', valueEs: 'Mesa' },
  { namespace: 'qrs', key: 'cuit', value: 'CUIT', valueEs: 'CUIT' },
  { namespace: 'qrs', key: 'assignmentStatus', value: 'Assignment Status', valueEs: 'Estado de Asignación' },
  { namespace: 'qrs', key: 'assigned', value: 'Assigned', valueEs: 'Asignado' },
  { namespace: 'qrs', key: 'unassigned', value: 'Unassigned', valueEs: 'No asignado' },
  { namespace: 'qrs', key: 'addNewQR', value: 'Add New QR', valueEs: 'Agregar Nuevo QR' },
  { namespace: 'qrs', key: 'addNewQRDescription', value: 'Create a new QR code for a table', valueEs: 'Crea un nuevo código QR para una mesa' },
  { namespace: 'qrs', key: 'createQR', value: 'Create QR', valueEs: 'Crear QR' },
  { namespace: 'qrs', key: 'viewQR', value: 'View QR', valueEs: 'Ver QR' },
  { namespace: 'qrs', key: 'request3DPrint', value: 'Request 3D Print', valueEs: 'Solicitar impresión 3D' },
  { namespace: 'qrs', key: 'tags', value: 'Tags', valueEs: 'Tags' },
  { namespace: 'qrs', key: 'manageTags', value: 'Manage Tags', valueEs: 'Gestionar Tags' },
  { namespace: 'qrs', key: 'dragTagsHere', value: 'Drag tags here or click +', valueEs: 'Arrastra tags aquí o haz clic en +' },
  { namespace: 'qrs', key: 'availableTags', value: 'Available Tags', valueEs: 'Tags Disponibles' },
  { namespace: 'qrs', key: 'createTag', value: 'Create Tag', valueEs: 'Crear Tag' },
  { namespace: 'qrs', key: 'dragTagsHint', value: 'Drag tags to QR cards or click to add', valueEs: 'Arrastra los tags a las tarjetas QR o haz clic para agregar' },
  { namespace: 'qrs', key: 'createNewTag', value: 'Create New Tag', valueEs: 'Crear Nuevo Tag' },
  { namespace: 'qrs', key: 'name', value: 'Name', valueEs: 'Nombre' },
  { namespace: 'qrs', key: 'color', value: 'Color', valueEs: 'Color' },
  { namespace: 'qrs', key: 'tagNamePlaceholder', value: 'e.g., Patio, VIP Room...', valueEs: 'Ej: Patio, Salón VIP...' },
  { namespace: 'qrs', key: 'creating', value: 'Creating...', valueEs: 'Creando...' },
  { namespace: 'qrs', key: 'createAndAssign', value: 'Create and Assign', valueEs: 'Crear y Asignar' },
  { namespace: 'qrs', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'qrs', key: 'assignedTags', value: 'Assigned Tags', valueEs: 'Tags Asignados' },
  { namespace: 'qrs', key: 'noTagsAssigned', value: 'No tags assigned', valueEs: 'No hay tags asignados' },
  { namespace: 'qrs', key: 'close', value: 'Close', valueEs: 'Cerrar' },
  { namespace: 'qrs', key: 'newQR', value: 'New QR', valueEs: 'Nuevo QR' },
  { namespace: 'qrs', key: 'createQRWarning', value: 'The QR you are about to create will not be printed. Are you sure you want to create it?', valueEs: 'El QR que estas a punto de crear no va a estar impreso, ¿estás seguro de que quieres crearlo?' },
  { namespace: 'qrs', key: 'create', value: 'Create', valueEs: 'Crear' },
  { namespace: 'qrs', key: 'download', value: 'Download', valueEs: 'Descargar' },
  { namespace: 'qrs', key: 'visitQR', value: 'Visit QR', valueEs: 'Visitar QR' },
  { namespace: 'qrs', key: 'errorLoadingQR', value: 'Error loading QR', valueEs: 'Error al cargar QR' },
  { namespace: 'qrs', key: 'sendQRViaWhatsApp', value: 'Send QR via WhatsApp', valueEs: 'Enviar QR por WhatsApp' },
  { namespace: 'qrs', key: 'phoneNumber', value: 'Phone Number', valueEs: 'Número de Teléfono' },
  { namespace: 'qrs', key: 'downloadQR', value: 'Download QR', valueEs: 'Descargar QR' },
  { namespace: 'qrs', key: 'send', value: 'Send', valueEs: 'Enviar' },
  { namespace: 'qrs', key: 'sending', value: 'Sending...', valueEs: 'Enviando...' },
  { namespace: 'qrs', key: 'unprintedQRs', value: "QR's not printed", valueEs: "QR's no impresos" },
  { namespace: 'qrs', key: 'unprintedQRsDescription', value: 'The following QRs are not printed and do not have a print request.', valueEs: 'Los siguientes QR se encuentran sin imprimir y sin una solicitud de impresión.' },
  { namespace: 'qrs', key: 'noPendingQRs', value: 'No pending QRs', valueEs: 'No hay QR pendientes' },
  { namespace: 'qrs', key: 'sendAll', value: 'Send all (Coming soon)', valueEs: 'Enviar todos (Proximamente)' },
  { namespace: 'qrs', key: 'search', value: 'Search', valueEs: 'Buscar' },
  { namespace: 'qrs', key: 'sortBy', value: 'Sort by', valueEs: 'Ordenar por' },
  { namespace: 'qrs', key: 'qrCreated', value: 'QR created successfully', valueEs: 'QR creado exitosamente' },
  { namespace: 'qrs', key: 'qrCreateError', value: 'Error creating QR', valueEs: 'Error al crear QR' },
  { namespace: 'qrs', key: 'qrAssigned', value: 'QR assigned successfully', valueEs: 'QR asignado exitosamente' },
  { namespace: 'qrs', key: 'qrAssignError', value: 'Error assigning QR', valueEs: 'Error al asignar QR' },
  { namespace: 'qrs', key: 'tagCreated', value: 'Tag created successfully', valueEs: 'Tag creado exitosamente' },
  { namespace: 'qrs', key: 'tagCreateError', value: 'Error creating tag', valueEs: 'Error al crear tag' },
  { namespace: 'qrs', key: 'tagAssignError', value: 'Error assigning tag', valueEs: 'Error al asignar tag' },
  { namespace: 'qrs', key: 'tagRemoveError', value: 'Error removing tag', valueEs: 'Error al eliminar tag' },
  { namespace: 'qrs', key: 'qrSent', value: 'QR sent via WhatsApp', valueEs: 'QR enviado por WhatsApp' },
  { namespace: 'qrs', key: 'qrSendError', value: 'Error sending QR', valueEs: 'Error al enviar QR' },
  { namespace: 'qrs', key: 'qrDownloaded', value: 'QR downloaded successfully', valueEs: 'QR descargado exitosamente' },
  { namespace: 'qrs', key: 'qrDownloadError', value: 'Error downloading QR', valueEs: 'Error al descargar QR' },
  { namespace: 'qrs', key: 'qrLoadError', value: 'Error loading QR', valueEs: 'Error al cargar QR' },
  
  // Staff translations
  { namespace: 'staff', key: 'title', value: 'My Staff', valueEs: 'Mi Personal' },
  { namespace: 'staff', key: 'pageHeaderTooltip', value: 'Manage your staff, roles, and employee information.', valueEs: 'Gestiona tu personal, roles e información de empleados.' },
  { namespace: 'staff', key: 'workers', value: 'Workers', valueEs: 'Trabajadores' },
  { namespace: 'staff', key: 'roles', value: 'Roles', valueEs: 'Roles' },
  { namespace: 'staff', key: 'sortBy', value: 'Sort by', valueEs: 'Ordenar por' },
  { namespace: 'staff', key: 'totalPercentage', value: 'Total percentage', valueEs: 'Porcentaje total' },
  { namespace: 'staff', key: 'available', value: 'available', valueEs: 'disponible' },
  { namespace: 'staff', key: 'search', value: 'Search', valueEs: 'Buscar' },
  { namespace: 'staff', key: 'name', value: 'Name', valueEs: 'Nombre' },
  { namespace: 'staff', key: 'addWorker', value: 'Add Worker', valueEs: 'Agregar Trabajador' },
  { namespace: 'staff', key: 'addWorkerDescription', value: 'Add a new worker and then assign a role to them.', valueEs: 'Agrega un nuevo trabajador y luego asígnale un rol.' },
  { namespace: 'staff', key: 'add', value: 'Add', valueEs: 'Agregar' },
  { namespace: 'staff', key: 'addRole', value: 'Add Role', valueEs: 'Agregar Rol' },
  { namespace: 'staff', key: 'addRoleDescription', value: 'Add a new role and then assign a percentage of tip.', valueEs: 'Agrega un nuevo rol y luego asígnale un porcentaje de propina.' },
  { namespace: 'staff', key: 'editRole', value: 'Edit Role', valueEs: 'Editar Rol' },
  { namespace: 'staff', key: 'color', value: 'Color', valueEs: 'Color' },
  { namespace: 'staff', key: 'percentage', value: 'Percentage', valueEs: 'Porcentaje' },
  { namespace: 'staff', key: 'percentageAvailable', value: 'Percentage available', valueEs: 'Porcentaje disponible' },
  { namespace: 'staff', key: 'totalRolesCannotExceed', value: 'The total of all roles cannot exceed 100%', valueEs: 'El total de todos los roles no puede exceder el 100%' },
  { namespace: 'staff', key: 'enterRoleName', value: 'Enter the role name', valueEs: 'Ingresa el nombre del rol' },
  { namespace: 'staff', key: 'selectColor', value: 'Select color', valueEs: 'Seleccionar color' },
  { namespace: 'staff', key: 'selectPercentage', value: 'Select percentage', valueEs: 'Seleccionar porcentaje' },
  { namespace: 'staff', key: 'creating', value: 'Creating...', valueEs: 'Creando...' },
  { namespace: 'staff', key: 'updating', value: 'Updating...', valueEs: 'Actualizando...' },
  { namespace: 'staff', key: 'addRoleButton', value: 'Add Role', valueEs: 'Agregar Rol' },
  { namespace: 'staff', key: 'updateRoleButton', value: 'Update Role', valueEs: 'Actualizar Rol' },
  { namespace: 'staff', key: 'loadingEmployees', value: 'Loading employees...', valueEs: 'Cargando empleados...' },
  { namespace: 'staff', key: 'noEmployeesFound', value: 'No employees found', valueEs: 'No se encontraron empleados' },
  { namespace: 'staff', key: 'noRolesFound', value: 'No roles found. Add your first role.', valueEs: 'No se encontraron roles. Agrega tu primer rol.' },
  { namespace: 'staff', key: 'delete', value: 'Delete', valueEs: 'Eliminar' },
  { namespace: 'staff', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'staff', key: 'edit', value: 'Edit', valueEs: 'Editar' },
  { namespace: 'staff', key: 'role', value: 'Role', valueEs: 'Rol' },
  { namespace: 'staff', key: 'noRole', value: 'No Role', valueEs: 'Sin Rol' },
  { namespace: 'staff', key: 'withMP', value: 'With MP', valueEs: 'Con MP' },
  { namespace: 'staff', key: 'withoutMP', value: 'Without MP', valueEs: 'Sin MP' },
  { namespace: 'staff', key: 'linkMP', value: 'Link MP', valueEs: 'Vincular MP' },
  { namespace: 'staff', key: 'qrOnboarding', value: 'QR Onboarding', valueEs: 'QR Onboarding' },
  { namespace: 'staff', key: 'employees', value: 'employees', valueEs: 'empleados' },
  { namespace: 'staff', key: 'confirmRoleDeletion', value: 'Confirm role deletion', valueEs: 'Confirmar eliminación de rol' },
  { namespace: 'staff', key: 'confirmEmployeeDeletion', value: 'Confirm employee deletion', valueEs: 'Confirmar eliminación de empleado' },
  { namespace: 'staff', key: 'sureDeleteRole', value: 'Are you sure you want to delete the role', valueEs: '¿Estás seguro de que deseas eliminar el rol' },
  { namespace: 'staff', key: 'sureDeleteEmployee', value: 'Are you sure you want to delete the employee', valueEs: '¿Estás seguro de que deseas eliminar el empleado' },
  { namespace: 'staff', key: 'roleCreated', value: 'Role created successfully', valueEs: 'Rol creado exitosamente' },
  { namespace: 'staff', key: 'roleCreateError', value: 'Error creating role', valueEs: 'Error al crear rol' },
  { namespace: 'staff', key: 'roleUpdated', value: 'Role updated successfully', valueEs: 'Rol actualizado exitosamente' },
  { namespace: 'staff', key: 'roleUpdateError', value: 'Error updating role', valueEs: 'Error al actualizar rol' },
  { namespace: 'staff', key: 'roleDeleted', value: 'Role deleted successfully', valueEs: 'Rol eliminado exitosamente' },
  { namespace: 'staff', key: 'roleDeleteError', value: 'Error deleting role', valueEs: 'Error al eliminar rol' },
  { namespace: 'staff', key: 'employeeDeleted', value: 'Employee deleted successfully', valueEs: 'Empleado eliminado exitosamente' },
  { namespace: 'staff', key: 'employeeDeleteError', value: 'Error deleting employee', valueEs: 'Error al eliminar empleado' },
  { namespace: 'staff', key: 'employeeRoleUpdated', value: 'Employee role updated successfully', valueEs: 'Rol del empleado actualizado exitosamente' },
  { namespace: 'staff', key: 'employeeRoleUpdateError', value: 'Error updating employee role', valueEs: 'Error al actualizar rol del empleado' },
  { namespace: 'staff', key: 'pleaseCompleteFields', value: 'Please complete all required fields', valueEs: 'Por favor completa todos los campos requeridos' },
  { namespace: 'staff', key: 'comingSoon', value: 'Coming soon', valueEs: 'Próximamente' },
  { namespace: 'staff', key: 'red', value: 'Red', valueEs: 'Rojo' },
  { namespace: 'staff', key: 'green', value: 'Green', valueEs: 'Verde' },
  { namespace: 'staff', key: 'blue', value: 'Blue', valueEs: 'Azul' },
  { namespace: 'staff', key: 'orange', value: 'Orange', valueEs: 'Naranja' },
  { namespace: 'staff', key: 'purple', value: 'Purple', valueEs: 'Morado' },
  { namespace: 'staff', key: 'firstName', value: 'First Name', valueEs: 'Nombre' },
  { namespace: 'staff', key: 'lastName', value: 'Last Name', valueEs: 'Apellido' },
  { namespace: 'staff', key: 'enterFirstName', value: 'Enter first name', valueEs: 'Ingresa el nombre' },
  { namespace: 'staff', key: 'enterLastName', value: 'Enter last name', valueEs: 'Ingresa el apellido' },
  { namespace: 'staff', key: 'firstNameRequired', value: 'First name is required', valueEs: 'El nombre es obligatorio' },
  { namespace: 'staff', key: 'select', value: 'Select', valueEs: 'Seleccionar' },
  { namespace: 'staff', key: 'selectFromDevice', value: 'Select from my device', valueEs: 'Seleccionar desde mi dispositivo' },
  { namespace: 'staff', key: 'alsoDragHere', value: 'You can also drag it here.', valueEs: 'También puedes arrastrarlo aquí.' },
  { namespace: 'staff', key: 'updateWorker', value: 'Update Worker', valueEs: 'Actualizar Trabajador' },
  { namespace: 'staff', key: 'searchPersonByCuit', value: 'Search person by CUIT', valueEs: 'Buscar persona por CUIT' },
  { namespace: 'staff', key: 'noDashesSpaces', value: '(No dashes or spaces)', valueEs: '(Sin guiones ni espacios)' },
  { namespace: 'staff', key: 'searching', value: 'Searching...', valueEs: 'Buscando...' },
  { namespace: 'staff', key: 'searchAnother', value: 'Search another', valueEs: 'Buscar otro' },
  { namespace: 'staff', key: 'notAvailable', value: 'Not available', valueEs: 'No disponible' },
  { namespace: 'staff', key: 'assignRole', value: 'Assign a role!', valueEs: '¡Asigna un rol!' },
  { namespace: 'staff', key: 'selectRole', value: 'Select a role', valueEs: 'Selecciona un rol' },
  { namespace: 'staff', key: 'adding', value: 'Adding...', valueEs: 'Agregando...' },
  { namespace: 'staff', key: 'pleaseEnterCuit', value: 'Please enter a CUIT', valueEs: 'Por favor ingresa un CUIT' },
  { namespace: 'staff', key: 'cuitMinimumDigits', value: 'CUIT must have at least 8 digits', valueEs: 'El CUIT debe tener al menos 8 dígitos' },
  { namespace: 'staff', key: 'cuitMaximumDigits', value: 'CUIT cannot have more than 11 digits', valueEs: 'El CUIT no puede tener más de 11 dígitos' },
  { namespace: 'staff', key: 'cuitNumbersOnly', value: 'CUIT can only contain numbers', valueEs: 'El CUIT solo puede contener números' },
  { namespace: 'staff', key: 'noEmployeeFoundCuit', value: 'No employee found with that CUIT', valueEs: 'No se encontró empleado con ese CUIT' },
  { namespace: 'staff', key: 'pleaseSearchEmployeeSelectRole', value: 'Please search for an employee and select a role', valueEs: 'Por favor busca un empleado y selecciona un rol' },
  { namespace: 'staff', key: 'employeeAlreadyRegistered', value: 'The employee is already registered in your restaurant with the role', valueEs: 'El empleado ya está registrado en tu restaurante con el rol' },
  { namespace: 'staff', key: 'cannotSameEmployeeMultipleRoles', value: 'It is not possible to have the same employee with multiple roles.', valueEs: 'No es posible tener el mismo empleado con múltiples roles.' },
  { namespace: 'staff', key: 'roleCreated', value: 'Role Created', valueEs: 'Rol Creado' },
  { namespace: 'staff', key: 'roleCreatedSuccessfully', value: 'The new role has been created successfully.', valueEs: 'El nuevo rol ha sido creado exitosamente.' },
  { namespace: 'staff', key: 'roleUpdated', value: 'Role Updated', valueEs: 'Rol Actualizado' },
  { namespace: 'staff', key: 'roleUpdatedSuccessfully', value: 'The role has been updated successfully.', valueEs: 'El rol ha sido actualizado exitosamente.' },
  { namespace: 'staff', key: 'roleDeleted', value: 'Role Deleted', valueEs: 'Rol Eliminado' },
  { namespace: 'staff', key: 'roleDeletedSuccessfully', value: 'The role has been deleted successfully.', valueEs: 'El rol ha sido eliminado exitosamente.' },
  { namespace: 'staff', key: 'employeeDeleted', value: 'Employee Deleted', valueEs: 'Empleado Eliminado' },
  { namespace: 'staff', key: 'employeeDeletedSuccessfully', value: 'The employee has been deleted successfully.', valueEs: 'El empleado ha sido eliminado exitosamente.' },
  { namespace: 'staff', key: 'employeeAdded', value: 'Employee Added', valueEs: 'Empleado Agregado' },
  { namespace: 'staff', key: 'employeeAddedSuccessfully', value: 'The new employee has been added successfully.', valueEs: 'El nuevo empleado ha sido agregado exitosamente.' },
  { namespace: 'staff', key: 'employeeUpdated', value: 'Employee Updated', valueEs: 'Empleado Actualizado' },
  { namespace: 'staff', key: 'employeeUpdatedSuccessfully', value: 'The employee data has been updated successfully.', valueEs: 'Los datos del empleado han sido actualizados exitosamente.' },
  { namespace: 'staff', key: 'employeeLinked', value: 'Employee Linked', valueEs: 'Empleado Vinculado' },
  { namespace: 'staff', key: 'employeeLinkedSuccessfully', value: 'The employee has been linked successfully.', valueEs: 'El empleado ha sido vinculado exitosamente.' },
  { namespace: 'staff', key: 'errorAddingEmployee', value: 'Error adding the employee.', valueEs: 'Error al agregar el empleado.' },
  { namespace: 'staff', key: 'errorUpdatingEmployee', value: 'Error updating the employee.', valueEs: 'Error al actualizar el empleado.' },
  { namespace: 'staff', key: 'errorLinkingMP', value: 'Error linking MercadoPago', valueEs: 'Error al vincular MercadoPago' },
  { namespace: 'staff', key: 'loadingPage', value: 'Loading page...', valueEs: 'Cargando página...' },
  
  // VincularMP translations
  { namespace: 'staff.vincularMP', key: 'title', value: 'Link MercadoPago', valueEs: 'Vincular MercadoPago' },
  { namespace: 'staff.vincularMP', key: 'description', value: 'Link your employee to MercadoPago to receive tips.', valueEs: 'Vincula tu empleado a MercadoPago para recibir propinas.' },
  { namespace: 'staff.vincularMP', key: 'copyLinkDescription', value: 'You can copy the link and send it manually, or send it via WhatsApp.', valueEs: 'Puedes copiar el enlace y enviarlo manualmente, o enviarlo por WhatsApp.' },
  { namespace: 'staff.vincularMP', key: 'whatsappDescription', value: 'Sending via WhatsApp will open the app with the link pre-filled.', valueEs: 'Enviar por WhatsApp abrirá la aplicación con el enlace prellenado.' },
  { namespace: 'staff.vincularMP', key: 'phoneNumberLabel', value: 'Phone Number', valueEs: 'Número de Teléfono' },
  { namespace: 'staff.vincularMP', key: 'phoneNumberPlaceholder', value: 'Enter phone number', valueEs: 'Ingresa el número de teléfono' },
  { namespace: 'staff.vincularMP', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'staff.vincularMP', key: 'copyLink', value: 'Copy Link', valueEs: 'Copiar Enlace' },
  { namespace: 'staff.vincularMP', key: 'copying', value: 'Copying...', valueEs: 'Copiando...' },
  { namespace: 'staff.vincularMP', key: 'sendWhatsApp', value: 'Send via WhatsApp', valueEs: 'Enviar por WhatsApp' },
  { namespace: 'staff.vincularMP', key: 'sending', value: 'Sending...', valueEs: 'Enviando...' },
  { namespace: 'staff.vincularMP', key: 'linkCopied', value: 'Link copied to clipboard', valueEs: 'Enlace copiado al portapapeles' },
  { namespace: 'staff.vincularMP', key: 'linkCopyError', value: 'Error copying link', valueEs: 'Error al copiar el enlace' },
  { namespace: 'staff.vincularMP', key: 'whatsappSent', value: 'WhatsApp message sent successfully', valueEs: 'Mensaje de WhatsApp enviado exitosamente' },
  { namespace: 'staff.vincularMP', key: 'whatsappError', value: 'Error sending WhatsApp message', valueEs: 'Error al enviar mensaje de WhatsApp' },
  
  // Socios translations
  { namespace: 'socios', key: 'title', value: 'My Business', valueEs: 'Mi Negocio' },
  { namespace: 'socios', key: 'pageHeaderTooltip', value: 'View and analyze statistics from all your restaurants.', valueEs: 'Visualiza y analiza estadísticas de todos tus restaurantes.' },
  { namespace: 'socios', key: 'mainRestaurant', value: 'Main Restaurant', valueEs: 'Restaurante Principal' },
  { namespace: 'socios', key: 'comparisonRestaurant', value: 'Comparison Restaurant', valueEs: 'Restaurante de Comparación' },
  { namespace: 'socios', key: 'removeComparison', value: 'Remove comparison', valueEs: 'Eliminar comparación' },
  { namespace: 'socios', key: 'noDataAvailable', value: 'No data available', valueEs: 'No hay datos disponibles' },
  { namespace: 'socios', key: 'tipsHistory', value: 'Tips History', valueEs: 'Historial de Propinas' },
  { namespace: 'socios', key: 'page', value: 'Page', valueEs: 'Página' },
  { namespace: 'socios', key: 'of', value: 'of', valueEs: 'de' },
  { namespace: 'socios', key: 'previous', value: 'Previous', valueEs: 'Anterior' },
  { namespace: 'socios', key: 'next', value: 'Next', valueEs: 'Siguiente' },
  
  // Socios - Tabs
  { namespace: 'socios.tabs', key: 'tips', value: 'Tips', valueEs: 'Propinas' },
  { namespace: 'socios.tabs', key: 'reviews', value: 'Reviews', valueEs: 'Reseñas' },
  
  // Socios - Cards
  { namespace: 'socios.cards', key: 'total_tips_and_cash', value: 'Total Sales via QR', valueEs: 'Total Ventas por QR' },
  { namespace: 'socios.cards', key: 'count_tips', value: 'Amount of Tips', valueEs: 'Cantidad de Propinas' },
  { namespace: 'socios.cards', key: 'average_tip', value: 'Average Tip', valueEs: 'Propina Promedio' },
  { namespace: 'socios.cards', key: 'active_qrs_count', value: 'Active QRs', valueEs: 'QRs Activos' },
  { namespace: 'socios.cards', key: 'roles_count', value: 'Roles', valueEs: 'Roles' },
  { namespace: 'socios.cards', key: 'employees_count', value: 'Employees', valueEs: 'Empleados' },
  { namespace: 'socios.cards', key: 'tip_historic_daily', value: 'Daily Tips History', valueEs: 'Historial Diario de Propinas' },
  { namespace: 'socios.cards', key: 'payment_methods_count', value: 'Payment Methods (Digital)', valueEs: 'Métodos de Pago (Digital)' },
  { namespace: 'socios.cards', key: 'avg_tip_by_days', value: 'Average Tips by Day', valueEs: 'Propina Promedio por Día' },
  { namespace: 'socios.cards', key: 'top_5_tips_accumulated_waiter', value: 'Top 5 Employees', valueEs: 'Top 5 Empleados' },
  { namespace: 'socios.cards', key: 'review_historic_daily', value: 'Daily Reviews', valueEs: 'Reseñas Diarias' },
  { namespace: 'socios.cards', key: 'rating_historic_daily', value: 'Daily Ratings', valueEs: 'Calificaciones Diarias' },
  { namespace: 'socios.cards', key: 'withoutTippit', value: 'Total Cash', valueEs: 'Total Efectivo' },
  { namespace: 'socios.cards', key: 'withTippit', value: 'Total Tips', valueEs: 'Total Propinas' },
  
  // Socios - FilterBar
  { namespace: 'socios.filterBar', key: 'filter', value: 'Filter', valueEs: 'Filtrar' },
  { namespace: 'socios.filterBar', key: 'filters', value: 'Filters', valueEs: 'Filtros' },
  { namespace: 'socios.filterBar', key: 'sortBy', value: 'Sort by', valueEs: 'Ordenar por' },
  { namespace: 'socios.filterBar', key: 'fromDate', value: 'From Date', valueEs: 'Fecha Desde' },
  { namespace: 'socios.filterBar', key: 'toDate', value: 'To Date', valueEs: 'Fecha Hasta' },
  { namespace: 'socios.filterBar', key: 'clear', value: 'Clear', valueEs: 'Limpiar' },
  { namespace: 'socios.filterBar', key: 'apply', value: 'Apply', valueEs: 'Aplicar' },
  { namespace: 'socios.filterBar', key: 'errorDateBefore2023', value: 'Date cannot be before 2023', valueEs: 'La fecha no puede ser anterior a 2023' },
  { namespace: 'socios.filterBar', key: 'errorToDateBeforeFromDate', value: 'End date must be after start date', valueEs: 'La fecha de fin debe ser posterior a la fecha de inicio' },
  
  // Socios - Switcher
  { namespace: 'socios.switcher', key: 'switchOrCompare', value: 'Switch or Compare', valueEs: 'Cambiar o Comparar' },
  { namespace: 'socios.switcher', key: 'doYouWantToSwitch', value: 'Do you want to switch to', valueEs: '¿Deseas cambiar a' },
  { namespace: 'socios.switcher', key: 'orAddForComparison', value: 'or add it for comparison?', valueEs: 'o agregarlo para comparar?' },
  { namespace: 'socios.switcher', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'socios.switcher', key: 'switchTo', value: 'Switch to', valueEs: 'Cambiar a' },
  { namespace: 'socios.switcher', key: 'compareWith', value: 'Compare with', valueEs: 'Comparar con' },
  { namespace: 'socios.switcher', key: 'removeComparison', value: 'Remove Comparison', valueEs: 'Eliminar Comparación' },
  
  // Dashboard translations
  { namespace: 'dashboard', key: 'notAuthUser', value: 'You are not authorized to view this page.', valueEs: 'No estás autorizado para ver esta página.' },
  
  // Dashboard - Mozo
  { namespace: 'dashboard.mozo', key: 'hello', value: 'Hello', valueEs: 'Hola' },
  { namespace: 'dashboard.mozo', key: 'pageHeaderTooltip', value: 'In this section you can view your weekly tips summary, check your MercadoPago account status, and manage your pending transfers.', valueEs: 'En esta sección puedes ver el resumen semanal de tus propinas, verificar el estado de tu cuenta de MercadoPago y gestionar tus transferencias pendientes.' },
  { namespace: 'dashboard.mozo', key: 'yourTips', value: 'Your Tips', valueEs: 'Tus Propinas' },
  { namespace: 'dashboard.mozo', key: 'totalPending', value: 'Total Pending', valueEs: 'Total Pendiente' },
  { namespace: 'dashboard.mozo', key: 'totalTransferred', value: 'Total Transferred', valueEs: 'Total Transferido' },
  { namespace: 'dashboard.mozo', key: 'weeklyTipsTotal', value: 'Weekly Tips Total', valueEs: 'Total de Propinas Semanales' },
  { namespace: 'dashboard.mozo', key: 'accountStatus', value: 'Tippit Account Status', valueEs: 'Estado de Cuenta Tippit' },
  { namespace: 'dashboard.mozo', key: 'noTipsThisWeek', value: 'You didn\'t have any tips this week!', valueEs: '¡No tuviste propinas esta semana!' },
  { namespace: 'dashboard.mozo', key: 'dontDespair', value: 'Don\'t despair! Keep providing excellent service.', valueEs: '¡No te desanimes! Sigue brindando un excelente servicio.' },
  { namespace: 'dashboard.mozo', key: 'connectMercadoPago', value: 'Connect MercadoPago', valueEs: 'Conectar MercadoPago' },
  { namespace: 'dashboard.mozo', key: 'connectMercadoPagoDescription', value: 'To receive your tips, you need to connect your MercadoPago account.', valueEs: 'Para recibir tus propinas, necesitas conectar tu cuenta de MercadoPago.' },
  { namespace: 'dashboard.mozo', key: 'connectNow', value: 'Connect Now', valueEs: 'Conectar Ahora' },
  { namespace: 'dashboard.mozo', key: 'transferValidated', value: 'Transfer validated successfully', valueEs: 'Transferencia validada exitosamente' },
  { namespace: 'dashboard.mozo', key: 'transferValidationError', value: 'Error validating transfer', valueEs: 'Error al validar la transferencia' },
  { namespace: 'dashboard.mozo', key: 'validateTransfer', value: 'Validate Transfer', valueEs: 'Validar Transferencia' },
  { namespace: 'dashboard.mozo', key: 'operationNumber', value: 'Operation Number', valueEs: 'Número de Operación' },
  { namespace: 'dashboard.mozo', key: 'enterOperationNumber', value: 'Enter operation number', valueEs: 'Ingresa el número de operación' },
  { namespace: 'dashboard.mozo', key: 'cancel', value: 'Cancel', valueEs: 'Cancelar' },
  { namespace: 'dashboard.mozo', key: 'validate', value: 'Validate', valueEs: 'Validar' },
  { namespace: 'dashboard.mozo', key: 'validating', value: 'Validating...', valueEs: 'Validando...' },
  { namespace: 'dashboard.mozo', key: 'accreditedTip', value: 'Accredited Tip', valueEs: 'Propina Acreditada' },
  { namespace: 'dashboard.mozo', key: 'transfer', value: 'Transfer', valueEs: 'Transferencia' },
  { namespace: 'dashboard.mozo', key: 'tipsDistribution', value: 'Tips Distribution', valueEs: 'Distribución de Propinas' },
  { namespace: 'dashboard.mozo', key: 'others', value: 'Others', valueEs: 'Otros' },
  
  // Dashboard - Restaurant
  { namespace: 'dashboard.restaurant', key: 'yourRestaurant', value: 'Your Restaurant', valueEs: 'Tu Restaurante' },
  { namespace: 'dashboard.restaurant', key: 'pageHeaderTooltip', value: 'View and manage all payments and tips from your restaurant.', valueEs: 'Visualiza y gestiona todos los pagos y propinas de tu restaurante.' },
  { namespace: 'dashboard.restaurant', key: 'totalTips', value: 'Total Tips', valueEs: 'Total de Propinas' },
  { namespace: 'dashboard.restaurant', key: 'thisWeek', value: 'this week', valueEs: 'esta semana' },
  { namespace: 'dashboard.restaurant', key: 'last30Days', value: 'last 30 days', valueEs: 'últimos 30 días' },
  { namespace: 'dashboard.restaurant', key: 'thisYear', value: 'this year', valueEs: 'este año' },
  { namespace: 'dashboard.restaurant', key: 'showAll', value: 'Show All', valueEs: 'Mostrar Todo' },
  
  // Dashboard - Restaurant Buttons
  { namespace: 'dashboard.restaurant.buttons', key: 'viewByTime', value: 'View by Time', valueEs: 'Ver por Tiempo' },
  { namespace: 'dashboard.restaurant.buttons', key: 'viewByTable', value: 'View by Table', valueEs: 'Ver por Mesa' },
  { namespace: 'dashboard.restaurant.buttons', key: 'viewByWaiter', value: 'View by Waiter', valueEs: 'Ver por Mozo' },
  
  // Dashboard - Restaurant Time
  { namespace: 'dashboard.restaurant.time', key: 'thisWeek', value: 'This Week', valueEs: 'Esta Semana' },
  { namespace: 'dashboard.restaurant.time', key: 'lastMonth', value: 'Last Month', valueEs: 'Último Mes' },
  { namespace: 'dashboard.restaurant.time', key: 'thisYear', value: 'This Year', valueEs: 'Este Año' },
  
  // Dashboard - Mesa
  { namespace: 'dashboard.mesa', key: 'mostFrequentStaff', value: 'Most Frequent Staff', valueEs: 'Personal Más Frecuente' },
  { namespace: 'dashboard.mesa', key: 'highestTip', value: 'Highest Tip', valueEs: 'Propina Más Alta' },
  { namespace: 'dashboard.mesa', key: 'averageTip', value: 'Average Tip', valueEs: 'Propina Promedio' },
  { namespace: 'dashboard.mesa', key: 'averageRating', value: 'Average Rating', valueEs: 'Calificación Promedio' },
  { namespace: 'dashboard.mesa', key: 'noData', value: 'No data', valueEs: 'Sin datos' },
  
  // Dashboard - Payments
  { namespace: 'dashboard.payments', key: 'accreditedTip', value: 'Credited Tip', valueEs: 'Propina Acreditada' },
  { namespace: 'dashboard.payments', key: 'pendingTip', value: 'Pending Tip', valueEs: 'Propina Pendiente' },
  { namespace: 'dashboard.payments', key: 'pendingTipLabel', value: 'Pending tip', valueEs: 'Propina pendiente' },
  
  // Dashboard - Consejos
  { namespace: 'dashboard.mozo.consejos', key: 'tip1', value: 'Introduce yourself, tell them your name and ask for theirs.', valueEs: 'Presentate, deciles tu nombre y preguntales el suyo.' },
  { namespace: 'dashboard.mozo.consejos', key: 'tip2', value: 'Maintain a positive and helpful attitude.', valueEs: 'Mantené una actitud positiva y servicial.' },
  { namespace: 'dashboard.mozo.consejos', key: 'tip3', value: 'Regularly check if customers need anything.', valueEs: 'Verificá regularmente si los clientes necesitan algo.' },
  { namespace: 'dashboard.mozo.consejos', key: 'tip4', value: 'Be attentive to details and personalize the service.', valueEs: 'Sé atento a los detalles y personalizá el servicio.' },
  { namespace: 'dashboard.mozo.consejos', key: 'tip5', value: 'Thank customers for their visit.', valueEs: 'Agradecé a los clientes por su visita.' },
  { namespace: 'dashboard.mozo.consejos', key: 'tip6', value: 'Say goodbye with a smile and a thank you.', valueEs: 'Despedite con una sonrisa y un agradecimiento.' },
  { namespace: 'dashboard.mozo.consejos', key: 'anotherTip', value: 'Another Tip', valueEs: 'Otro Consejo' },
];

async function findMenuItemByKey(key: string, locale: string = 'en') {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/menu-items?locale=${locale}&filters[key][$eq]=${key}`,
      { headers }
    );
    const items = response.data?.data || [];
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    return null;
  }
}

async function createMenuItem(item: any, locale: string = 'en') {
  // Check if item already exists
  const existing = await findMenuItemByKey(item.key, locale);
  
  const data = {
    data: {
      key: item.key,
      label: locale === 'es' ? item.labelEs : item.label,
      path: item.path,
      icon: item.icon,
      order: item.order,
      enabled: item.enabled,
      roles: item.roles,
    }
  };

  let response;
  if (existing) {
    // Update existing item
    const updateUrl = `${STRAPI_URL}/api/menu-items/${existing.id}${locale ? `?locale=${locale}` : ''}`;
    try {
      response = await axios.put(updateUrl, data, { headers });
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Item doesn't exist, create it
        const createUrl = locale ? `${STRAPI_URL}/api/menu-items?locale=${locale}` : `${STRAPI_URL}/api/menu-items`;
        response = await axios.post(createUrl, data, { headers });
      } else {
        throw error;
      }
    }
  } else {
    // Create new item
    const createUrl = locale ? `${STRAPI_URL}/api/menu-items?locale=${locale}` : `${STRAPI_URL}/api/menu-items`;
    response = await axios.post(createUrl, data, { headers });
  }
  
  if (response.data?.data?.id) {
    try {
      await axios.put(
        `${STRAPI_URL}/api/menu-items/${response.data.data.id}${locale ? `?locale=${locale}` : ''}`,
        { data: { publishedAt: new Date().toISOString() } },
        { headers }
      );
    } catch (e) {
      // Ignore publish errors
    }
  }
  
  return response.data;
}

async function findTranslationByKeyAndNamespace(key: string, namespace: string, locale: string = 'en') {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/translations?locale=${locale}&filters[key][$eq]=${key}&filters[namespace][$eq]=${namespace}`,
      { headers }
    );
    const items = response.data?.data || [];
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    return null;
  }
}

async function createTranslation(trans: any, locale: string = 'en') {
  // Check if translation already exists
  const existing = await findTranslationByKeyAndNamespace(trans.key, trans.namespace, locale);
  
  const data = {
    data: {
      key: trans.key,
      value: locale === 'es' ? trans.valueEs : trans.value,
      namespace: trans.namespace,
    }
  };

  let response;
  if (existing) {
    // Update existing translation
    const updateUrl = `${STRAPI_URL}/api/translations/${existing.id}${locale ? `?locale=${locale}` : ''}`;
    try {
      response = await axios.put(updateUrl, data, { headers });
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Translation doesn't exist, create it
        const createUrl = locale ? `${STRAPI_URL}/api/translations?locale=${locale}` : `${STRAPI_URL}/api/translations`;
        response = await axios.post(createUrl, data, { headers });
      } else {
        throw error;
      }
    }
  } else {
    // Create new translation
    const createUrl = locale ? `${STRAPI_URL}/api/translations?locale=${locale}` : `${STRAPI_URL}/api/translations`;
    response = await axios.post(createUrl, data, { headers });
  }
  
  if (response.data?.data?.id) {
    try {
      await axios.put(
        `${STRAPI_URL}/api/translations/${response.data.data.id}${locale ? `?locale=${locale}` : ''}`,
        { data: { publishedAt: new Date().toISOString() } },
        { headers }
      );
    } catch (e) {
      // Ignore
    }
  }
  
  return response.data;
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Step 1: Ensure content types exist with fields
  console.log('📦 Setting up Content Types...\n');
  
  const menuSchema = await getContentTypeSchema('menu-items');
  const hasMenuFields = menuSchema?.attributes && Object.keys(menuSchema.attributes).length > 0;
  
  const transSchema = await getContentTypeSchema('translations');
  const hasTransFields = transSchema?.attributes && Object.keys(transSchema.attributes).length > 0;
  
  if (!hasMenuFields || !hasTransFields) {
    console.log('\n  ⚠️  CRITICAL: Content types exist but have NO FIELDS!');
    console.log('\n  📋 QUICK FIX - Add fields in Strapi admin:\n');
    
    if (!hasMenuFields) {
      console.log('  🔹 Menu Item:');
      console.log('     1. Go to: https://strapi-tippit-u63628.vm.elestio.app/admin');
      console.log('     2. Content-Type Builder > Menu Item > Add fields:');
      console.log('        • key (Text, Required, Unique)');
      console.log('        • label (Text, Required, Enable i18n)');
      console.log('        • path (Text, Required)');
      console.log('        • icon (Text, Required)');
      console.log('        • order (Number/Integer, Required)');
      console.log('        • enabled (Boolean)');
      console.log('        • roles (JSON)');
      console.log('     3. Save\n');
    }
    
    if (!hasTransFields) {
      console.log('  🔹 Translation:');
      console.log('     1. Content-Type Builder > Translation > Add fields:');
      console.log('        • key (Text, Required)');
      console.log('        • value (Text/Long text, Required, Enable i18n)');
      console.log('        • namespace (Text, Required)');
      console.log('     2. Save\n');
    }
    
    console.log('  ✅ After adding fields, run: npm run seed\n');
    console.log('  💡 For automated setup, see: strapi-schemas/bootstrap.ts\n');
    return; // Exit early - can't proceed without fields
  }
  
  console.log('  ✅ Menu Item has fields');
  console.log('  ✅ Translation has fields');

  // Step 2: Seed data
  console.log('\n📋 Creating/Updating Menu Items...');
  let menuSuccess = 0;
  let menuUpdated = 0;
  for (const item of menuItemsData) {
    try {
      const existingEn = await findMenuItemByKey(item.key, 'en');
      await createMenuItem(item, 'en');
      if (existingEn) {
        console.log(`  🔄 Updated: ${item.key} (en)`);
        menuUpdated++;
      } else {
        console.log(`  ✅ Created: ${item.key} (en)`);
        menuSuccess++;
      }
      try {
        const existingEs = await findMenuItemByKey(item.key, 'es');
        await createMenuItem(item, 'es');
        if (existingEs) {
          console.log(`  🔄 Updated: ${item.key} (es)`);
        } else {
          console.log(`  ✅ Created: ${item.key} (es)`);
        }
      } catch (e) {
        console.log(`  ⚠️  Spanish skipped for ${item.key}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error(`  ❌ Failed: ${item.key} - ${errorMsg}`);
    }
  }

  console.log('\n🌐 Creating/Updating Translations...');
  let transSuccess = 0;
  let transUpdated = 0;
  for (const trans of translationsData) {
    try {
      const existingEn = await findTranslationByKeyAndNamespace(trans.key, trans.namespace, 'en');
      await createTranslation(trans, 'en');
      if (existingEn) {
        console.log(`  🔄 Updated: ${trans.namespace}.${trans.key} (en)`);
        transUpdated++;
      } else {
        console.log(`  ✅ Created: ${trans.namespace}.${trans.key} (en)`);
        transSuccess++;
      }
      try {
        const existingEs = await findTranslationByKeyAndNamespace(trans.key, trans.namespace, 'es');
        await createTranslation(trans, 'es');
        if (existingEs) {
          console.log(`  🔄 Updated: ${trans.namespace}.${trans.key} (es)`);
        } else {
          console.log(`  ✅ Created: ${trans.namespace}.${trans.key} (es)`);
        }
      } catch (e) {
        console.log(`  ⚠️  Spanish skipped for ${trans.namespace}.${trans.key}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error(`  ❌ Failed: ${trans.namespace}.${trans.key} - ${errorMsg}`);
    }
  }

  console.log(`\n✨ Seed completed!`);
  console.log(`   Menu items: ${menuSuccess} created, ${menuUpdated} updated (${menuItemsData.length} total)`);
  console.log(`   Translations: ${transSuccess} created, ${transUpdated} updated (${translationsData.length} total)`);
}

seed().catch(console.error);
