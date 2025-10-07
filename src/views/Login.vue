<template>
  <div class="auth-page">
    <AuthCard :title="MESSAGES.title">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <!-- Error general de credenciales -->
        <div
          v-if="generalError"
          class="auth-error-message"
          role="alert"
          aria-live="polite"
        >
          {{ generalError }}
        </div>

        <!-- Campo de Email -->
        <AuthField
          v-model="email"
          :label="MESSAGES.emailLabel"
          type="email"
          :placeholder="MESSAGES.emailPlaceholder"
          :error="emailError"
          :disabled="loading"
          @blur="validateEmail"
        />

        <!-- Campo de Contraseña -->
        <PasswordField
          v-model="password"
          :label="MESSAGES.passwordLabel"
          :placeholder="MESSAGES.passwordPlaceholder"
          :error="passwordError"
          :disabled="loading"
          @blur="validatePassword"
        />

        <!-- Botón de envío -->
        <button
          type="submit"
          :class="['auth-button', { 'auth-button--loading': loading }]"
          :disabled="loading"
          :aria-busy="loading"
        >
          <span v-if="!loading">{{ MESSAGES.loginButton }}</span>
          <div v-if="loading" class="auth-button__spinner"></div>
        </button>
      </form>

      <!-- Footer con enlace a registro -->
      <div class="auth-footer">
        {{ MESSAGES.noAccount }}
        <router-link to="/register" class="auth-footer__link">
          {{ MESSAGES.registerLink }}
        </router-link>
      </div>
    </AuthCard>
  </div>
</template>

<script setup>
/*
  CÓMO PROBAR EL MOCK:
  - Credenciales válidas: email="test@ejemplo.com" y password="password"
  - Cualquier otra combinación mostrará error de credenciales
  - La contraseña debe tener mínimo 8 caracteres
  - El email debe tener formato válido
  - 5% de probabilidad de error de red simulado
*/

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '../components/auth/AuthCard.vue'
import AuthField from '../components/auth/AuthField.vue'
import PasswordField from '../components/auth/PasswordField.vue'
import { login, setAuthenticated } from '../utils/mockAuth.js'
import { isValidEmail, isValidPassword } from '../utils/validators.js'
import { useAsyncAction } from '../composables/useAsyncAction.js'

const router = useRouter()

// Mensajes de UI (preparado para i18n futuro)
const MESSAGES = {
  title: 'Bienvenido a Energix',
  emailLabel: 'Correo Electrónico',
  emailPlaceholder: 'ejemplo@correo.com',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: 'Ingrese su contraseña',
  loginButton: 'Iniciar Sesión',
  noAccount: '¿No tiene una cuenta?',
  registerLink: 'Regístrese aquí',
  errors: {
    emailRequired: 'El correo electrónico es requerido',
    emailInvalid: 'El formato del correo electrónico no es válido',
    passwordRequired: 'La contraseña es requerida',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres'
  }
}

// Estado del formulario
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')

// Composable para manejar loading
const { loading, execute } = useAsyncAction()

// Validación de email
const validateEmail = () => {
  emailError.value = ''
  if (!email.value) {
    emailError.value = MESSAGES.errors.emailRequired
    return false
  }
  if (!isValidEmail(email.value)) {
    emailError.value = MESSAGES.errors.emailInvalid
    return false
  }
  return true
}

// Validación de contraseña
const validatePassword = () => {
  passwordError.value = ''
  if (!password.value) {
    passwordError.value = MESSAGES.errors.passwordRequired
    return false
  }
  if (!isValidPassword(password.value)) {
    passwordError.value = MESSAGES.errors.passwordMinLength
    return false
  }
  return true
}

// Manejo del envío del formulario
const handleSubmit = async () => {
  generalError.value = ''

  // Validar campos
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  if (!isEmailValid || !isPasswordValid) {
    return
  }

  try {
    await execute(async () => {
      const result = await login({
        email: email.value,
        password: password.value
      })

      // Éxito: guardar estado y redirigir
      setAuthenticated(true)
      await router.push({ name: 'dashboard' })

      return result
    })
  } catch (error) {
    // Manejar errores de red vs errores de credenciales
    if (error.network) {
      generalError.value = error.message
    } else {
      generalError.value = error.message || 'Error al iniciar sesión'
    }
  }
}
</script>

<style scoped>
@import '../styles/auth.css';
</style>