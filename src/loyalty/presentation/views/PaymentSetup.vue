<template>
    <div class="auth-page">
        <div class="payment-card">
            <header class="payment-card__header">
                <button class="payment-card__back" @click="goBack" :disabled="loading">
                    ← {{ $t('common.cancel') }}
                </button>
                <h1 class="payment-card__title">{{ $t('paymentSetup.title') }}</h1>
                <p class="payment-card__subtitle">
                    {{ $t('paymentSetup.selectedPlan') }}: <strong>{{ planDisplayName }}</strong>
                </p>
            </header>

            <div v-if="generalError" class="auth-error-message" role="alert" aria-live="polite">
                {{ generalError }}
            </div>

            <form class="payment-form" @submit.prevent="processPayment">
                <!-- Titular de la tarjeta -->
                <div class="auth-field">
                    <label class="auth-field__label">{{ $t('subscriptions.billing.cardholder') }}</label>
                    <input v-model="cardData.holder" type="text" class="auth-field__input"
                        :class="{ 'auth-field__input--error': errors.holder }"
                        :placeholder="$t('subscriptions.billing.cardholderPlaceholder')" :disabled="loading"
                        @blur="validateField('holder')" />
                    <span v-if="errors.holder" class="auth-field__error">{{ errors.holder }}</span>
                </div>

                <!-- Número de tarjeta -->
                <div class="auth-field">
                    <label class="auth-field__label">{{ $t('subscriptions.billing.cardNumber') }}</label>
                    <input v-model="cardData.number" type="text" class="auth-field__input"
                        :class="{ 'auth-field__input--error': errors.number }"
                        :placeholder="$t('subscriptions.billing.cardNumberPlaceholder')" :disabled="loading"
                        maxlength="19" @input="formatCardNumber" @blur="validateField('number')" />
                    <span v-if="errors.number" class="auth-field__error">{{ errors.number }}</span>
                </div>

                <div class="payment-form__row">
                    <!-- Fecha de expiración -->
                    <div class="auth-field">
                        <label class="auth-field__label">{{ $t('subscriptions.billing.expiry') }}</label>
                        <input v-model="cardData.expiry" type="text" class="auth-field__input"
                            :class="{ 'auth-field__input--error': errors.expiry }"
                            :placeholder="$t('subscriptions.billing.expiryPlaceholder')" :disabled="loading"
                            maxlength="5" @input="formatExpiry" @blur="validateField('expiry')" />
                        <span v-if="errors.expiry" class="auth-field__error">{{ errors.expiry }}</span>
                    </div>

                    <!-- CVV -->
                    <div class="auth-field">
                        <label class="auth-field__label">{{ $t('subscriptions.billing.cvv') }}</label>
                        <input v-model="cardData.cvv" type="password" class="auth-field__input"
                            :class="{ 'auth-field__input--error': errors.cvv }"
                            :placeholder="$t('subscriptions.billing.cvvPlaceholder')" :disabled="loading" maxlength="4"
                            @blur="validateField('cvv')" />
                        <span v-if="errors.cvv" class="auth-field__error">{{ errors.cvv }}</span>
                    </div>
                </div>

                <!-- Resumen del plan -->
                <div class="payment-summary">
                    <div class="payment-summary__row">
                        <span>{{ planDisplayName }}</span>
                        <span>{{ planPrice }}/{{ $t('planSelection.month') }}</span>
                    </div>
                    <div class="payment-summary__total">
                        <span>{{ $t('paymentSetup.total') }}</span>
                        <span>{{ planPrice }}</span>
                    </div>
                </div>

                <div class="payment-form__actions">
                    <button type="submit" class="auth-button" :class="{ 'auth-button--loading': loading }"
                        :disabled="loading">
                        <span v-if="!loading">{{ $t('paymentSetup.confirmPayment') }}</span>
                        <div v-if="loading" class="auth-button__spinner"></div>
                    </button>

                    <button type="button" class="payment-form__fallback" :disabled="loading" @click="fallbackToBasic">
                        {{ $t('paymentSetup.continueBasic') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SubscriptionsApi, PlanType, BillingPeriod } from '@/loyalty/infrastructure/subscriptions.endpoint.js'
import { updateTokenAndPlan, setPlanSelectionPending } from '@/identity/domain/auth/auth.service.js'

const router = useRouter()
const { t } = useI18n()

const pendingPlan = ref(sessionStorage.getItem('pending-plan') || 'student')
const loading = ref(false)
const generalError = ref('')

const cardData = ref({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
})

const errors = ref({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
})

/**
 * Nombre del plan a mostrar
 */
const planDisplayName = computed(() => {
    const plans = {
        student: t('subscriptions.plans.student.name'),
        family: t('subscriptions.plans.family.name')
    }
    return plans[pendingPlan.value] || t('subscriptions.plans.student.name')
})

/**
 * Precio del plan
 */
const planPrice = computed(() => {
    const prices = {
        student: 'S/ 9.90',
        family: 'S/ 19.90'
    }
    return prices[pendingPlan.value] || 'S/ 9.90'
})

/**
 * Obtiene el PlanType numérico según el plan seleccionado
 */
const getPlanTypeNumber = () => {
    const types = {
        student: PlanType.Student,
        family: PlanType.FamilyPremium
    }
    return types[pendingPlan.value] || PlanType.Student
}

/**
 * Formatea el número de tarjeta (grupos de 4)
 */
const formatCardNumber = () => {
    const digits = cardData.value.number.replace(/\D/g, '').slice(0, 16)
    cardData.value.number = digits.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * Formatea la fecha de expiración (MM/YY)
 */
const formatExpiry = () => {
    const digits = cardData.value.expiry.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
        cardData.value.expiry = `${digits.slice(0, 2)}/${digits.slice(2)}`
    } else {
        cardData.value.expiry = digits
    }
}

/**
 * Valida un campo específico
 */
const validateField = (fieldName) => {
    errors.value[fieldName] = ''

    switch (fieldName) {
        case 'holder':
            if (!cardData.value.holder.trim()) {
                errors.value.holder = t('subscriptions.messages.errors.cardholderRequired')
            }
            break
        case 'number':
            const num = cardData.value.number.replace(/\s/g, '')
            if (!/^\d{16}$/.test(num)) {
                errors.value.number = t('subscriptions.messages.errors.invalidCard')
            }
            // Validar que no termine en 0000 (gateway fake lo rechaza)
            if (num.endsWith('0000')) {
                errors.value.number = t('subscriptions.messages.errors.invalidCard')
            }
            break
        case 'expiry':
            if (!/^\d{2}\/\d{2}$/.test(cardData.value.expiry)) {
                errors.value.expiry = t('subscriptions.messages.errors.invalidExpiry')
            } else {
                // Validar que no esté expirada
                const [month, year] = cardData.value.expiry.split('/')
                const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1)
                if (expDate < new Date()) {
                    errors.value.expiry = t('subscriptions.messages.errors.invalidExpiry')
                }
            }
            break
        case 'cvv':
            if (!/^\d{3,4}$/.test(cardData.value.cvv)) {
                errors.value.cvv = t('subscriptions.messages.errors.invalidCvv')
            }
            break
    }
}

/**
 * Valida todos los campos
 */
const validateAllFields = () => {
    const fields = ['holder', 'number', 'expiry', 'cvv']
    fields.forEach(validateField)
    return !Object.values(errors.value).some(e => e)
}

/**
 * Procesa el pago y crea la suscripción
 */
const processPayment = async () => {
    generalError.value = ''

    if (!validateAllFields()) {
        return
    }

    loading.value = true

    try {
        // Preparar datos para el endpoint
        const [expiryMonth, expiryYear] = cardData.value.expiry.split('/')

        const payload = {
            planType: getPlanTypeNumber(),
            billingPeriod: BillingPeriod.Monthly,
            cardNumber: cardData.value.number.replace(/\s/g, ''),
            expiryMonth: expiryMonth,
            expiryYear: `20${expiryYear}`, // Convertir a 4 dígitos
            cvv: cardData.value.cvv
        }

        const response = await SubscriptionsApi.upgrade(payload)

        // Guardar nuevo token y plan
        updateTokenAndPlan(response.token, response.plan)
        setPlanSelectionPending(false)

        // Limpiar sessionStorage
        sessionStorage.removeItem('pending-plan')

        // Ir al dashboard
        await router.replace({ name: 'dashboard' })
    } catch (error) {
        generalError.value = error.message || t('paymentSetup.error')
        // No redirigimos automáticamente a Basic, dejamos que el usuario decida
    } finally {
        loading.value = false
    }
}

/**
 * Continúa con plan Basic (fallback)
 */
const fallbackToBasic = async () => {
    generalError.value = ''
    loading.value = true

    try {
        const response = await SubscriptionsApi.upgrade({
            planType: PlanType.Basic,
            billingPeriod: BillingPeriod.Monthly
        })

        // Guardar nuevo token y plan
        updateTokenAndPlan(response.token, response.plan)
        setPlanSelectionPending(false)

        // Limpiar sessionStorage
        sessionStorage.removeItem('pending-plan')

        // Ir al dashboard
        await router.replace({ name: 'dashboard' })
    } catch (error) {
        generalError.value = error.message || t('paymentSetup.error')
    } finally {
        loading.value = false
    }
}

/**
 * Vuelve a la selección de plan
 */
const goBack = () => {
    router.push({ name: 'plan-selection' })
}

/**
 * Verificar que haya un plan pendiente
 */
onMounted(() => {
    if (!pendingPlan.value || pendingPlan.value === 'basic') {
        router.replace({ name: 'plan-selection' })
    }
})
</script>

<style scoped>
@import '@/identity/presentation/styles/auth.css';

.payment-card {
    background: var(--color-white, #fff);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 480px;
}

.payment-card__header {
    margin-bottom: 32px;
}

.payment-card__back {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    margin-bottom: 16px;
    transition: color 0.2s ease;
}

.payment-card__back:hover:not(:disabled) {
    color: #002349;
}

.payment-card__back:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.payment-card__title {
    color: #002349;
    font-family: Poppins, sans-serif;
    font-weight: 600;
    font-size: 24px;
    margin: 0 0 8px;
}

.payment-card__subtitle {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.payment-card__subtitle strong {
    color: #002349;
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.payment-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.payment-summary {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;
    margin-top: 8px;
}

.payment-summary__row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #374151;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 12px;
}

.payment-summary__total {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    color: #002349;
}

.payment-form__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
}

.payment-form__fallback {
    background: transparent;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.payment-form__fallback:hover:not(:disabled) {
    border-color: #002349;
    color: #002349;
}

.payment-form__fallback:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .payment-card {
        padding: 24px;
        margin: 16px;
    }

    .payment-form__row {
        grid-template-columns: 1fr;
    }
}
</style>
