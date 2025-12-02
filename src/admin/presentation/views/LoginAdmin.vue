<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="admin-login-header">
        <div class="admin-logo">
          <i class="pi pi-shield text-6xl mb-3" style="color: var(--color-primary)"></i>
        </div>
        <h1 class="text-4xl font-bold mb-2" style="color: var(--color-primary)">
          Acceso al Panel Admin
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
            Email de Usuario
          </label>
          <InputText
            id="adminEmail"
            v-model="credentials.email"
            type="email"
            placeholder="usuario@ejemplo.com"
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
          Ingresa con cualquier cuenta de usuario registrada
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthApi } from '@/identity/infrastructure/endpoint/auth.endpoint.js'

// Importaciones de PrimeVue
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
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
    console.log('🔐 Login admin usando sistema normal de autenticación...')

    // Usar el mismo sistema de login que el login normal
    const response = await AuthApi.login({
      email: credentials.value.email,
      password: credentials.value.password
    })

    console.log('✅ Login exitoso:', response)

    // ⭐ LIMPIAR CUALQUIER ESTADO PREVIO
    localStorage.removeItem('energix-mode')
    localStorage.removeItem('planSelectionPending')

    // ⭐ ESTABLECER MODO ADMIN PRIMERO Y VERIFICAR
    localStorage.setItem('energix-mode', 'admin')
    const modeVerification = localStorage.getItem('energix-mode')
    console.log('🔐 Modo admin establecido:', modeVerification === 'admin' ? '✅' : '❌')

    // Guardar el token y datos del usuario (mismo que login normal)
    localStorage.setItem('token', response.token)
    localStorage.setItem('energix-user', JSON.stringify(response.user))
    localStorage.setItem('energix-plan', response.plan?.uiKey || 'basic')
    localStorage.setItem('isAuthenticated', 'true')

    if (rememberMe.value) {
      localStorage.setItem('energix-admin-remember', 'true')
    }

    console.log('🚀 Redirigiendo al panel de administración...')
    console.log('📍 URL objetivo: /admin')

    // ⭐ USAR REPLACE Y FORZAR REDIRECCIÓN
    await router.replace('/admin')

    // Verificación adicional
    setTimeout(() => {
      if (router.currentRoute.value.path !== '/admin') {
        console.warn('⚠️ Redirección falló, intentando nuevamente...')
        router.replace('/admin')
      }
    }, 100)

  } catch (error) {
    console.error('❌ Error en login admin:', error)
    errorMessage.value = error.message || 'Credenciales inválidas. Verifica tu email y contraseña.'
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

@media (max-width: 768px) {
  .admin-login-container {
    padding: 1rem;
  }

  .admin-login-card {
    padding: 2rem 1.5rem;
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

