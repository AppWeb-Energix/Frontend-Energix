<template>
  <div class="plans-wrap">
    <h2 class="title">Suscripciones</h2>
    <div class="options-bar">
      <button
          v-for="option in options"
          :key="option"
          :class="{ active: selectedOption === option }"
          @click="selectedOption = option"
      >
        {{ option }}
      </button>
    </div>
    <p class="subtitle">Aumentar el límite de tus dispositivos</p>
    <p class="description">Elige un plan. Los límites de dispositivos e historial cambian de inmediato en la app.</p>

    <div v-if="selectedOption === 'Cambiar plan'" class="plans-grid">
      <!-- Plan Básico -->
      <article class="plan-card basic" :class="{ 'is-current': user?.plan === 'basic' }">
        <header class="plan-head">
          <h3>Plan Básico</h3>
          <p class="meta">Dispositivos: 1 · Historial: 7 días</p>
        </header>
        <ul class="bullets">
          <li>Historial de consumo (últimos 7 días)</li>
          <li>Alertas básicas (límite mensual)</li>
          <li>Agrega dispositivos manualmente</li>
        </ul>
        <button
            v-if="user?.plan === 'basic'"
            class="btn btn-muted" disabled>Plan actual</button>
        <button
            v-else
            class="btn btn-primary"
            @click="changePlan('basic')">Elegir Plan Básico</button>
      </article>

      <!-- Plan Estudiantil (actual) -->
      <article class="plan-card student" :class="{ 'is-current': user?.plan === 'student' }">
        <header class="plan-head">
          <h3>Plan Estudiantil</h3>
          <p class="meta">Dispositivos: 2 · Historial: 90 días</p>
        </header>
        <ul class="bullets">
          <li>Todo lo del Plan Básico</li>
          <li>Historial ampliado (últimos 3 meses)</li>
          <li>Recomendaciones personalizadas</li>
          <li>Alertas inteligentes (consumo inusual, luces encendidas)</li>
          <li>Agregar maximo 2 dispositivos</li>
        </ul>
        <button
            v-if="user?.plan === 'student'"
            class="btn btn-muted" disabled>Plan actual</button>
        <button
            v-else
            class="btn btn-primary"
            @click="changePlan('student')">Elegir Plan Estudiantil</button>
      </article>

      <!-- Plan Familiar -->
      <article class="plan-card family" :class="{ 'is-current': user?.plan === 'family' }">
        <header class="plan-head">
          <h3>Plan Familiar (Premium)</h3>
          <p class="meta">Dispositivos: ∞ · Historial: ∞</p>
        </header>
        <ul class="bullets">
          <li>Todo lo del Plan Estudiantil</li>
          <li>Historial completo sin límites</li>
          <li>Pronóstico de consumo y ahorro estimado</li>
          <li>Exportación de reportes en PDF y Excel</li>
        </ul>
        <button
            v-if="user?.plan === 'family'"
            class="btn btn-muted" disabled>Plan actual</button>
        <button
            v-else
            class="btn btn-primary"
            @click="changePlan('family')">Elegir Familiar (Premium)</button>
      </article>

    </div>
    <div v-else-if="selectedOption === 'Renovar plan'" class="plans-grid">
      <article class="plan-card student is-current">
        <header class="plan-head">
          <h3>Plan Estudiantil</h3>
          <p class="meta">Dispositivos: 2 · Historial: 90 días</p>
        </header>
        <ul class="bullets">
          <li>Todo lo del Plan Básico</li>
          <li>Historial ampliado (últimos 3 meses)</li>
          <li>Recomendaciones personalizadas</li>
          <li>Alertas inteligentes (consumo inusual, luces encendidas)</li>
        </ul>
        <button class="btn btn-primary">Renovar</button>
      </article>
    </div>

    <div v-else-if="selectedOption === 'Cancelar plan'" class="plans-grid">
      <article class="plan-card student is-current">
        <header class="plan-head">
          <h3>Plan Estudiantil</h3>
          <p class="meta">Dispositivos: 2 · Historial: 90 días</p>
        </header>
        <ul class="bullets">
          <li>Todo lo del Plan Básico</li>
          <li>Historial ampliado (últimos 3 meses)</li>
          <li>Recomendaciones personalizadas</li>
          <li>Alertas inteligentes (consumo inusual, luces encendidas)</li>
        </ul>
        <button class="btn btn-primary">Cancelar</button>
      </article>
    </div>
    <!-- Divider -->
    <hr class="divider" />

    <section class="billing-wrap">
      <h3 class="billing-title">Método de pago</h3>
      <p class="billing-subtitle">Añade una tarjeta para activar y renovar tu plan.</p>

      <form class="card-form" @submit.prevent="saveCard">
        <div class="row">
          <label>
            Titular de la tarjeta
            <input v-model.trim="cardholder" type="text" placeholder="Nombre como aparece en la tarjeta" />
          </label>
        </div>

        <div class="row two">
          <label>
            Número de tarjeta
            <input
                v-model="cardnumber"
                @input="formatCardNumber"
                inputmode="numeric"
                autocomplete="cc-number"
                placeholder="1234 5678 9012 3456"
            />
          </label>

          <label>
            Vencimiento (MM/AA)
            <input
                v-model="expiry"
                @input="formatExpiry"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM/AA"
                maxlength="5"
            />
          </label>

          <label>
            CVV
            <input
                v-model="cvv"
                @input="onlyDigits('cvv', 4)"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="3 o 4 dígitos"
                maxlength="4"
            />
          </label>
        </div>

        <label class="chk">
          <input type="checkbox" v-model="asDefault" />
          Guardar como método predeterminado
        </label>

        <div class="actions">
          <button class="btn btn-primary" type="submit">Guardar tarjeta</button>
          <span v-if="saveMsg" class="success">{{ saveMsg }}</span>
          <span v-if="errorMsg" class="error">{{ errorMsg }}</span>
        </div>
      </form>
    </section>
  </div>
  <!-- Separador -->
  <hr class="divider" />
  <!-- TARJETAS GUARDADAS -->
  <section class="saved-cards-wrap">
    <h3 class="billing-title">Tarjetas guardadas</h3>
    <p class="billing-subtitle" v-if="!savedCards.length">Aún no tienes tarjetas guardadas.</p>

    <ul class="saved-list" v-else>
      <li v-for="c in savedCards" :key="c.id" class="saved-item">
        <div class="left">
          <div class="brand">{{ c.brand }}</div>
          <div class="meta">•••• •••• •••• {{ c.last4 }} · {{ c.exp }}</div>
          <span v-if="c.default" class="badge-default">Predeterminada</span>
        </div>
        <div class="right">
          <button class="btn btn-danger" @click="removeCard(c.id)">Eliminar</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

// Id del usuario actual simulado
const userId = 3

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3001/users/${userId}`)
    if (!res.ok) throw new Error('Error al obtener datos del usuario')
    user.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

async function changePlan(newPlan) {
  if (!user.value) return
  try {
    const res = await fetch(`http://localhost:3001/users/${user.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: newPlan })
    })
    if (!res.ok) throw new Error('No se pudo cambiar el plan')
    user.value.plan = newPlan
    alert(`Tu plan ahora es ${newPlan.toUpperCase()}`)
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

// Opciones de la barra superior
const options = ['Cambiar plan', 'Renovar plan', 'Cancelar plan']
const selectedOption = ref('Cambiar plan')

// --------- Estado tarjeta ----------
const cardholder = ref('')
const cardnumber = ref('')   // mostrado con espacios
const expiry = ref('')       // MM/AA
const cvv = ref('')
const asDefault = ref(true)

const saveMsg = ref('')
const errorMsg = ref('')

// --------- Helpers de formato/validación ----------
function onlyDigits(key, max = 4) {
  const v = cvv; // por ahora solo tenemos CVV
  v.value = v.value.replace(/\D/g, '').slice(0, max);
}

function formatCardNumber() {
  const digits = cardnumber.value.replace(/\D/g, '').slice(0, 16)
  cardnumber.value = digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry() {
  const d = expiry.value.replace(/\D/g, '').slice(0, 4)
  expiry.value = d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d
}

function luhnValid(num) {
  // num sin espacios
  const s = num.replace(/\s+/g, '')
  if (!/^\d{13,19}$/.test(s)) return false
  let sum = 0, dbl = false
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10)
    if (dbl) { n *= 2; if (n > 9) n -= 9 }
    sum += n; dbl = !dbl
  }
  return sum % 10 === 0
}

function expiryValid(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false
  const [mm, yy] = mmYY.split('/').map(n => parseInt(n, 10))
  if (mm < 1 || mm > 12) return false
  const year = 2000 + yy
  const now = new Date()
  const lastDay = new Date(year, mm, 0) // último día del mes
  return lastDay >= new Date(now.getFullYear(), now.getMonth(), 1)
}

function saveCard() {
  saveMsg.value = ''
  errorMsg.value = ''

  if (!cardholder.value.trim()) { errorMsg.value = 'Ingresa el titular de la tarjeta.'; return }
  if (!luhnValid(cardnumber.value)) { errorMsg.value = 'Número de tarjeta inválido.'; return }
  if (!expiryValid(expiry.value)) { errorMsg.value = 'Vencimiento inválido.'; return }
  if (!/^\d{3,4}$/.test(cvv.value)) { errorMsg.value = 'CVV inválido.'; return }

  // Aquí llamarías a tu backend: POST /billing/payment-methods
  // fetch('/api/payment-methods', { method:'POST', body: JSON.stringify({...}) })

  saveMsg.value = 'Tarjeta guardada correctamente.'
}

// Lista mock de tarjetas (cámbialo cuando conectes tu backend)
const savedCards = ref([
  { id: 'card_1', brand: 'Visa',       last4: '4242', exp: '12/27', default: true  },
  { id: 'card_2', brand: 'Mastercard', last4: '4444', exp: '08/26', default: false },
])

function removeCard(id) {
  if (!confirm('¿Eliminar esta tarjeta?')) return
  const idx = savedCards.value.findIndex(c => c.id === id)
  if (idx !== -1) savedCards.value.splice(idx, 1)


}

</script>

<style scoped>
/* Contenedor */
.saved-cards-wrap{
  background:#fff;
  border:2px solid var(--border);
  border-radius:16px;
  padding:18px 20px;
  box-shadow:var(--shadow);
  margin-top:16px;
}

/* Lista */
.saved-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px }
.saved-item{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px; background:#fafafa;
}
.saved-item .left{ display:flex; align-items:center; gap:12px; flex-wrap:wrap }
.saved-item .brand{ font-weight:700; color:#0f172a }
.saved-item .meta{ color:#6b7280 }
.badge-default{
  background:#e7eff9; color:#0e2c4a; border:1px solid #bfd4f3;
  padding:2px 8px; border-radius:999px; font-size:12px; font-weight:600;
}

/* Botón eliminar */
.btn-danger{
  background:#dc2626; color:#fff; border:none; border-radius:10px;
  padding:8px 14px; font-weight:600; cursor:pointer;
  box-shadow:0 2px 4px rgba(0,0,0,.12); transition:background .15s ease;
}
.btn-danger:hover{ background:#b91c1c }

.divider{
  border:0; height:1px; background:#e5e7eb; margin:28px 0 16px;
}

.billing-wrap{
  background:#fff;
  border:2px solid var(--border);
  border-radius:16px;
  padding:18px 20px;
  box-shadow:var(--shadow);
  margin-top:8px;
}

.billing-title{
  margin:0 0 2px; color:var(--ink); font-weight:800; font-size:1.2rem;
}
.billing-subtitle{ margin:0 0 14px; color:var(--muted) }

.card-form{ display:flex; flex-direction:column; gap:12px; }
.row{ display:flex; gap:12px; flex-wrap:wrap }
.row.two > label{ flex:1 1 180px }

label{ color:#111; font-weight:600; font-size:.9rem; display:flex; flex-direction:column; gap:6px }
input{
  background:#f9fafb; border:1px solid #d1d5db; border-radius:10px;
  padding:10px 12px; font-size:0.95rem; color:#0f172a; outline:none;
}
input:focus{ border-color:#001f49; box-shadow:0 0 0 3px rgba(0,31,73,.12) }

.chk{ display:flex; align-items:center; gap:8px; font-weight:600; color:#374151 }
.actions{ display:flex; align-items:center; gap:12px; margin-top:4px }
.success{ color:#059669; font-weight:600 }
.error{ color:#b91c1c; font-weight:600 }

:root{
  --navy:#0e2c4a;
  --navy-hover:#0b2239;
  --ink:#0f172a;
  --muted:#6b7280;
  --border:#e5e7eb;
  --blue-soft:#e7eff9;
  --blue-soft-border:#bfd4f3;
  --yellow-soft:#fff7da;
  --yellow-soft-border:#f2e4a6;
  --card-radius:14px;
  --shadow:0 2px 10px rgba(0,0,0,.06);
}

.plans-wrap{padding:32px;background:#f9fafb;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.title{margin:0;color:var(--ink);font-weight:800;font-size:1.8rem}
.subtitle{margin:4px 0 2px;color:var(--ink);font-size:1.2rem;font-weight:600}
.description{margin:0 0 18px;color:var(--muted);font-size:.95rem}

.plans-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
  gap:20px;
}

/* Tarjetas base */
.plan-card{
  background:#fff;
  border:2px solid var(--border);
  border-radius: 16px;
  padding:18px 20px 16px;
  box-shadow:var(--shadow);
  display:flex;flex-direction:column;justify-content:space-between;
  transition:transform .15s ease, box-shadow .15s ease;
}
.plan-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.08)}

.plan-head h3{margin:0;font-weight:700;color:var(--ink)}
.meta{margin:4px 0 0;font-size:.9rem;color:var(--muted)}
.bullets{margin:12px 0 16px;padding-left:18px;color:#1f2937}
.bullets li{margin:6px 0}

/* Variantes */
.plan-card.basic{background:#fff;border-color:var(--border)}
.plan-card.student{background:var(--blue-soft);border-color:var(--blue-soft-border)}
.plan-card.family{background:var(--yellow-soft);border-color:var(--yellow-soft-border)}
.plan-card.is-current{outline:2px solid var(--blue-soft-border);box-shadow:0 0 0 4px rgba(191,212,243,.35),var(--shadow)}

/* Botones */
.btn{
  align-self:flex-start;border-radius:10px;padding:10px 18px;
  border:none;cursor:pointer;font-weight:600;
  transition:background .15s ease,opacity .15s ease;
}
/* Botón azul */
.btn-primary {
  display: block;
  margin: 12px auto 0;        /* centra el botón */
  background: #001f49;        /* azul marino intenso */
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,.15);
  transition: background 0.2s ease, transform 0.1s ease;
}
.btn-primary:hover {
  background: #00163a;
  transform: translateY(-1px);
}

/* Botón gris del plan actual */
.btn-muted {
  display: block;
  margin: 12px auto 0;
  background: #9aa3ad;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: default;
  opacity: 0.9;
}


.options-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 24px 0 12px 0;
}
.options-bar button {
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.options-bar button.active,
.options-bar button:hover {
  background: #001f49;
  color: #fff;
}


/* Responsive */
@media(max-width:980px){.plans-grid{grid-template-columns:1fr}}
</style>

