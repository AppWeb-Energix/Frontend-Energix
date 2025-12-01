<template>
    <div class="auth-page">
        <div class="plan-selection-card">
            <header class="plan-selection__header">
                <h1 class="plan-selection__title">{{ $t('planSelection.title') }}</h1>
                <p class="plan-selection__subtitle">{{ $t('planSelection.subtitle') }}</p>
            </header>

            <div v-if="generalError" class="auth-error-message" role="alert" aria-live="polite">
                {{ generalError }}
            </div>

            <div class="plan-selection__grid">
                <!-- Plan Básico -->
                <article class="plan-card" :class="{ 'plan-card--selected': selectedPlan === 'basic' }"
                    @click="selectedPlan = 'basic'" role="button" tabindex="0" @keydown.enter="selectedPlan = 'basic'">
                    <div class="plan-card__badge plan-card__badge--free">{{ $t('planSelection.free') }}</div>
                    <h2 class="plan-card__name">{{ $t('subscriptions.plans.basic.name') }}</h2>
                    <p class="plan-card__price">
                        <span class="plan-card__price-amount">S/ 0</span>
                        <span class="plan-card__price-period">/{{ $t('planSelection.month') }}</span>
                    </p>
                    <ul class="plan-card__features">
                        <li>{{ $t('subscriptions.plans.basic.features.history') }}</li>
                        <li>{{ $t('subscriptions.plans.basic.features.alerts') }}</li>
                        <li>{{ $t('subscriptions.plans.basic.features.manual') }}</li>
                    </ul>
                    <div class="plan-card__meta">{{ $t('subscriptions.plans.basic.meta') }}</div>
                </article>

                <!-- Plan Estudiantil -->
                <article class="plan-card plan-card--popular"
                    :class="{ 'plan-card--selected': selectedPlan === 'student' }" @click="selectedPlan = 'student'"
                    role="button" tabindex="0" @keydown.enter="selectedPlan = 'student'">
                    <div class="plan-card__badge plan-card__badge--popular">{{ $t('planSelection.popular') }}</div>
                    <h2 class="plan-card__name">{{ $t('subscriptions.plans.student.name') }}</h2>
                    <p class="plan-card__price">
                        <span class="plan-card__price-amount">S/ 9.90</span>
                        <span class="plan-card__price-period">/{{ $t('planSelection.month') }}</span>
                    </p>
                    <ul class="plan-card__features">
                        <li>{{ $t('subscriptions.plans.student.features.basic') }}</li>
                        <li>{{ $t('subscriptions.plans.student.features.extendedHistory') }}</li>
                        <li>{{ $t('subscriptions.plans.student.features.recommendations') }}</li>
                        <li>{{ $t('subscriptions.plans.student.features.smartAlerts') }}</li>
                    </ul>
                    <div class="plan-card__meta">{{ $t('subscriptions.plans.student.meta') }}</div>
                </article>

                <!-- Plan Familiar -->
                <article class="plan-card" :class="{ 'plan-card--selected': selectedPlan === 'family' }"
                    @click="selectedPlan = 'family'" role="button" tabindex="0"
                    @keydown.enter="selectedPlan = 'family'">
                    <div class="plan-card__badge plan-card__badge--premium">Premium</div>
                    <h2 class="plan-card__name">{{ $t('subscriptions.plans.family.name') }}</h2>
                    <p class="plan-card__price">
                        <span class="plan-card__price-amount">S/ 19.90</span>
                        <span class="plan-card__price-period">/{{ $t('planSelection.month') }}</span>
                    </p>
                    <ul class="plan-card__features">
                        <li>{{ $t('subscriptions.plans.family.features.student') }}</li>
                        <li>{{ $t('subscriptions.plans.family.features.unlimitedHistory') }}</li>
                        <li>{{ $t('subscriptions.plans.family.features.forecast') }}</li>
                        <li>{{ $t('subscriptions.plans.family.features.export') }}</li>
                    </ul>
                    <div class="plan-card__meta">{{ $t('subscriptions.plans.family.meta') }}</div>
                </article>
            </div>

            <div class="plan-selection__actions">
                <button class="auth-button" :class="{ 'auth-button--loading': loading }" :disabled="loading"
                    @click="confirmSelection">
                    <span v-if="!loading">
                        {{ selectedPlan === 'basic' ? $t('planSelection.continueBasic') :
                            $t('planSelection.continuePayment') }}
                    </span>
                    <div v-if="loading" class="auth-button__spinner"></div>
                </button>

                <button class="plan-selection__skip" :disabled="loading" @click="skipSelection">
                    {{ $t('planSelection.skip') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SubscriptionsApi, PlanType, BillingPeriod } from '@/loyalty/infrastructure/subscriptions.endpoint.js'
import { updateTokenAndPlan, setPlanSelectionPending } from '@/identity/domain/auth/auth.service.js'

const router = useRouter()

const selectedPlan = ref('basic')
const loading = ref(false)
const generalError = ref('')

/**
 * Confirma la selección de plan
 * Si es Basic, llama directamente al upgrade
 * Si es de pago, redirige a PaymentSetup
 */
const confirmSelection = async () => {
    generalError.value = ''
    if (selectedPlan.value === 'basic') {
        // Plan Basic: llamar directamente a upgrade sin datos de pago
        loading.value = true
        try {
            const response = await SubscriptionsApi.upgrade({
                planType: PlanType.Basic,
                billingPeriod: BillingPeriod.Monthly
            })
            // Guardar nuevo token y plan
            updateTokenAndPlan(response.token, response.plan)
            setPlanSelectionPending(false)

            // Ir al dashboard
            await router.replace({ name: 'dashboard' })
        } catch (error) {
            generalError.value = error.message || 'Error al activar el plan'
        } finally {
            loading.value = false
        }
    } else {
        // Plan de pago: guardar selección y ir a PaymentSetup
        sessionStorage.setItem('pending-plan', selectedPlan.value)
        await router.push({ name: 'payment-setup' })
    }
}

/**
 * Omite la selección y asigna plan Basic
 */
const skipSelection = async () => {
    selectedPlan.value = 'basic'
    await confirmSelection()
}
</script>

<style scoped>
@import '../styles/auth.css';

.plan-selection-card {
    background: var(--color-white, #fff);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 900px;
}

.plan-selection__header {
    text-align: center;
    margin-bottom: 32px;
}

.plan-selection__title {
    color: #002349;
    font-family: Poppins, sans-serif;
    font-weight: 600;
    font-size: 28px;
    margin: 0 0 8px 0;
}

.plan-selection__subtitle {
    color: #6b7280;
    font-size: 16px;
    margin: 0;
}

.plan-selection__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
}

.plan-card {
    position: relative;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fff;
}

.plan-card:hover {
    border-color: #002349;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.plan-card--selected {
    border-color: #002349;
    background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);
    box-shadow: 0 8px 24px rgba(0, 35, 73, 0.15);
}

.plan-card--popular {
    border-color: #002349;
}

.plan-card__badge {
    position: absolute;
    top: -10px;
    right: 16px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.plan-card__badge--free {
    background: #e5e7eb;
    color: #374151;
}

.plan-card__badge--popular {
    background: #002349;
    color: #fff;
}

.plan-card__badge--premium {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #fff;
}

.plan-card__name {
    font-size: 20px;
    font-weight: 600;
    color: #002349;
    margin: 8px 0 16px;
}

.plan-card__price {
    margin: 0 0 20px;
}

.plan-card__price-amount {
    font-size: 32px;
    font-weight: 700;
    color: #002349;
}

.plan-card__price-period {
    font-size: 14px;
    color: #6b7280;
}

.plan-card__features {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
}

.plan-card__features li {
    padding: 8px 0;
    font-size: 14px;
    color: #374151;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.plan-card__features li::before {
    content: "✓";
    color: #10b981;
    font-weight: 600;
    flex-shrink: 0;
}

.plan-card__meta {
    font-size: 12px;
    color: #9ca3af;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
}

.plan-selection__actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
    margin: 0 auto;
}

.plan-selection__skip {
    background: transparent;
    border: none;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    padding: 12px;
    transition: color 0.2s ease;
}

.plan-selection__skip:hover:not(:disabled) {
    color: #002349;
    text-decoration: underline;
}

.plan-selection__skip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .plan-selection-card {
        padding: 24px;
        margin: 16px;
    }

    .plan-selection__title {
        font-size: 24px;
    }

    .plan-selection__grid {
        grid-template-columns: 1fr;
    }
}
</style>
