<template>
  <div class="auth-page">
    <!-- Selector de idioma en esquina superior izquierda -->
    <div class="language-switcher">
      <LanguageSwitcher />
    </div>

    <!-- Botón de acceso admin en esquina superior derecha -->
    <button
      @click="goToAdminLogin"
      class="admin-access-btn"
      :title="$t('auth.adminPanel')"
      type="button"
    >
      {{ $t('auth.adminPanel') }}
    </button>

    <AuthCard :title="$t('auth.title')">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div v-if="generalError" class="auth-error-message" role="alert" aria-live="polite">
          {{ generalError }}
        </div>

        <AuthField
          v-model="email"
          :label="$t('auth.emailLabel')"
          type="email"
          :placeholder="$t('auth.emailPlaceholder')"
          :error="emailError"
          :disabled="loading"
          @blur="validateEmail"
        />

        <PasswordField
          v-model="password"
          :label="$t('auth.passwordLabel')"
          :placeholder="$t('auth.passwordPlaceholder')"
          :error="passwordError"
          :disabled="loading"
          @blur="validatePassword"
        />

        <button type="submit" :class="['auth-button', { 'auth-button--loading': loading }]" :disabled="loading"
          :aria-busy="loading">
          <span v-if="!loading">{{ $t('auth.loginButton') }}</span>
          <div v-if="loading" class="auth-button__spinner"></div>
        </button>
      </form>

      <div class="auth-footer">
        {{ $t('auth.noAccount') }}
        <router-link to="/register" class="auth-footer__link">
          {{ $t('auth.registerLink') }}
        </router-link>
      </div>
    </AuthCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthCard from '../components/AuthCard.vue'
import AuthField from '../components/AuthField.vue'
import PasswordField from '../components/PasswordField.vue'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import { loginService } from '@/identity/domain/auth/auth.service.js'
import { isValidEmail, isValidPassword } from '@/identity/application/utils/validators.js'
import { useAsyncAction } from '@/identity/application/composables/useAsyncAction.js'
import { usePersonalizationStore } from '@/personalization/application/personalization.js'

const router = useRouter()
const personalizationStore = usePersonalizationStore()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')

const { loading, execute } = useAsyncAction()

// Función para ir al login de administrador
const goToAdminLogin = () => {
  router.push('/admin/login')
}

const validateEmail = () => {
  emailError.value = ''
  if (!email.value) {
    emailError.value = t('auth.errors.emailRequired')
    return false
  }
  if (!isValidEmail(email.value)) {
    emailError.value = t('auth.errors.emailInvalid')
    return false
  }
  return true
}

const validatePassword = () => {
  passwordError.value = ''
  if (!password.value) {
    passwordError.value = t('auth.errors.passwordRequired')
    return false
  }
  if (!isValidPassword(password.value)) {
    passwordError.value = t('auth.errors.passwordMinLength')
    return false
  }
  return true
}

const handleSubmit = async () => {
  generalError.value = ''

  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  if (!isEmailValid || !isPasswordValid) {
    return
  }

  try {
    await execute(async () => {
      const { user, planSelectionPending } = await loginService({ email: email.value, password: password.value })
      personalizationStore.loadPersonalization() // Carga la personalización del usuario que acaba de iniciar sesión
      personalizationStore.savePersonalization() // Guarda la personalización del usuario al iniciar sesión

      // Redirigir según el estado de selección de plan
      if (planSelectionPending) {
        await router.replace({ name: 'plan-selection' })
      } else {
        await router.replace({ name: 'dashboard' })
      }
      return user
    })
  } catch (error) {
    generalError.value = error.message || t('auth.errors.loginError')
  }
}
</script>

<style scoped>
@import '../styles/auth.css';

.language-switcher {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

.admin-access-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.admin-access-btn:hover {
  background: white;
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .language-switcher {
    top: 0.75rem;
    left: 0.75rem;
  }

  .admin-access-btn {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>