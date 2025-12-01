<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="admin-login-header">
        <div class="admin-logo">
          <i class="pi pi-shield text-6xl mb-3" style="color: var(--color-primary)"></i>
        </div>
        <h1 class="text-4xl font-bold mb-2" style="color: var(--color-primary)">
          Panel de Administración
        </h1>
        <p class="text-600 text-lg">Energix Control System</p>
      </div>

      <form @submit.prevent="handleLogin" class="admin-login-form">
        <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">
          {{ errorMessage }}
        </Message>

        <div class="field mb-4">
          <label for="adminEmail" class="block font-semibold mb-2">
            <i class="pi pi-user mr-2"></i>
            Email de Administrador
          </label>
          <InputText
            id="adminEmail"
            v-model="credentials.email"
            type="email"
            placeholder="admin@energix.com"
            class="w-full"
            :class="{ 'p-invalid': emailError }"
            required
            autofocus
          />
          <small v-if="emailError" class="p-error">{{ emailError }}</small>
        </div>

        <div class="field mb-4">
          <label for="adminPassword" class="block font-semibold mb-2">
            <i class="pi pi-lock mr-2"></i>
            Contraseña
          </label>
          <Password
            id="adminPassword"
            v-model="credentials.password"
            placeholder="••••••••"
            :toggleMask="true"
            class="w-full"
            :class="{ 'p-invalid': passwordError }"
            :feedback="false"
            required
          />
          <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
        </div>

        <div class="field-checkbox mb-4">
          <Checkbox
            id="rememberMe"
            v-model="rememberMe"
            :binary="true"
          />
          <label for="rememberMe" class="ml-2">Recordar sesión</label>
        </div>

        <Button
          type="submit"
          label="Iniciar Sesión"
          icon="pi pi-sign-in"
          class="w-full p-button-lg mb-3"
          :loading="loading"
          :style="{
            backgroundColor: 'var(--color-primary)',
            borderColor: 'var(--color-primary)'
          }"
        />

        <div class="text-center">
          <Button
            label="Volver al inicio"
            icon="pi pi-arrow-left"
            class="p-button-text p-button-sm"
            @click="goToHome"
          />
        </div>
      </form>

      <div class="admin-login-footer">
        <Divider />
        <div class="text-center text-sm text-500">
          <i class="pi pi-info-circle mr-2"></i>
          Solo personal autorizado puede acceder a este panel
        </div>
      </div>
    </div>

    <!-- Información de seguridad -->
    <div class="security-info">
      <Card class="security-card">
        <template #content>
          <div class="flex align-items-start gap-3">
            <i class="pi pi-shield text-3xl text-primary"></i>
            <div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-primary)">
                Acceso Seguro
              </h3>
              <ul class="text-sm text-600 pl-0" style="list-style: none;">
                <li class="mb-2">
                  <i class="pi pi-check-circle text-success mr-2"></i>
                  Conexión encriptada SSL/TLS
                </li>
                <li class="mb-2">
                  <i class="pi pi-check-circle text-success mr-2"></i>
                  Autenticación de dos factores
                </li>
                <li class="mb-2">
                  <i class="pi pi-check-circle text-success mr-2"></i>
                  Registro de auditoría completo
                </li>
              </ul>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Importaciones de PrimeVue
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Card from 'primevue/card'
import Divider from 'primevue/divider'

const router = useRouter()

const credentials = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

const validateForm = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  if (!credentials.value.email) {
    emailError.value = 'El email es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)) {
    emailError.value = 'Email inválido'
    isValid = false
  }

  if (!credentials.value.password) {
    passwordError.value = 'La contraseña es requerida'
    isValid = false
  } else if (credentials.value.password.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simular autenticación de admin
    // En producción, esto debería llamar a un endpoint real
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Credenciales de ejemplo para desarrollo
    // En producción, esto se validaría contra el backend
    const validAdminEmails = ['admin@energix.com', 'admin@localhost']
    const validPassword = 'admin123'

    if (validAdminEmails.includes(credentials.value.email) &&
        credentials.value.password === validPassword) {

      // Establecer el flag de modo admin
      localStorage.setItem('energix-mode', 'admin')
      localStorage.setItem('energix-admin-token', 'admin-token-' + Date.now())

      // Guardar información del admin
      localStorage.setItem('energix-user', JSON.stringify({
        email: credentials.value.email,
        role: 'Admin',
        name: 'Administrador'
      }))

      if (rememberMe.value) {
        localStorage.setItem('energix-admin-remember', 'true')
      }

      // Redirigir al panel de administración
      router.push('/admin')
    } else {
      errorMessage.value = 'Credenciales inválidas. Acceso denegado.'
    }
  } catch (error) {
    console.error('Error en el login de admin:', error)
    errorMessage.value = 'Error al conectar con el servidor. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.admin-login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.admin-login-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-logo {
  margin-bottom: 1rem;
}

.admin-login-form {
  margin-bottom: 1.5rem;
}

.field label {
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

:deep(.p-inputtext),
:deep(.p-password input) {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.p-inputtext:focus),
:deep(.p-password input:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 35, 73, 0.1);
}

:deep(.p-button) {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.p-button:hover) {
  background-color: var(--color-primary-dark) !important;
  border-color: var(--color-primary-dark) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 35, 73, 0.3);
}

.admin-login-footer {
  margin-top: 1.5rem;
}

.security-info {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  max-width: 350px;
  z-index: 1;
}

.security-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .admin-login-container {
    padding: 1rem;
  }

  .admin-login-card {
    padding: 2rem 1.5rem;
  }

  .security-info {
    position: static;
    margin-top: 2rem;
    max-width: 100%;
  }
}

.p-error {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

:deep(.p-invalid) {
  border-color: var(--color-error) !important;
}
</style>

