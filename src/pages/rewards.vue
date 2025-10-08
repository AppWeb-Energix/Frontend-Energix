<template>
  <section class="wrap">
    <h2 class="title">Recompensas</h2>
    <p class="subtitle">Invita y gana puntos. Canjéalos pronto por beneficios.</p>

    <!-- ===== Plans Dashboard View ===== -->
    <div class="grid">
      <article class="card kpi">
        <div class="kpi-top">
          <h3>Total de puntos</h3>
          <div class="points">{{ points }}</div>
        </div>
        <div class="progress">
          <div class="bar" :style="{ width: Math.min(levelProgress, 100) + '%' }"></div>
        </div>
        <p class="muted">Nivel {{ level }} · {{ levelProgress.toFixed(0) }}% hacia el siguiente</p>
      </article>

      <article class="card kpi">
        <h3>Referidos</h3>
        <p class="big">{{ stats.total }}</p>
        <p class="muted">Activos: {{ stats.activated }} · Recompensados: {{ stats.rewarded }}</p>
      </article>

      <article class="card kpi">
        <h3>Política de referidos</h3>
        <ul class="bullets">
          <li>1 código activo cada 24 h.</li>
          <li>Recompensa por referido activado: <b>+{{ POLICY.rewardPoints }}</b> pts.</li>
          <li>Máx. <b>{{ POLICY.maxUsesPerCode }}</b> usos por código.</li>
          <li>Requiere plan activo.</li>
        </ul>
      </article>
    </div>

    <!-- ===== Generate Referral Code (+ policy) ===== -->
    <article class="card">
      <div class="row between">
        <h3>Invita con tu código</h3>
        <span v-if="activeCode" class="badge">Código activo</span>
      </div>

      <div class="code-box" v-if="activeCode">
        <div class="code">{{ activeCode }}</div>
        <div class="code-actions">
          <button class="btn btn-primary" @click="copyCode">Copiar</button>
          <button class="btn outline" @click="shareLink">Compartir</button>
          <button class="btn danger" @click="revokeCode">Revocar</button>
        </div>
        <p class="muted">Caduca: {{ expiresAtHuman }}</p>
      </div>

      <div v-else class="no-code">
        <p class="muted">No tienes un código activo.</p>
        <button class="btn btn-primary" :disabled="!canGenerate" @click="generateCode">Generar código</button>
        <p v-if="!hasActivePlan" class="error small">Necesitas un plan activo para generar códigos.</p>
        <p v-if="cooldownMsg" class="muted small">Próximo intento: {{ cooldownMsg }}</p>
      </div>
    </article>

    <!-- ===== Reward Referrer / Referrer Rewarded ===== -->
    <article class="card">
      <h3>Historial de referidos</h3>

      <table class="table" v-if="referrals.length">
        <thead>
        <tr>
          <th>Usuario</th>
          <th>Código</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Puntos</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in referrals" :key="r.id">
          <td>{{ r.user }}</td>
          <td>{{ r.code }}</td>
          <td>
            <span :class="['status', r.status]">{{ labelStatus(r.status) }}</span>
          </td>
          <td>{{ formatDate(r.date) }}</td>
          <td>{{ r.points }}</td>
          <td class="actions-td">
            <button
                v-if="r.status === 'activated'"
                class="btn tiny btn-primary"
                @click="rewardReferrer(r.id)"
            >
              Acreditar recompensa
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <p v-else class="muted">Aún no tienes referidos.</p>
    </article>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

/** ===== Mock de usuario/plan (ajusta con tu store real) ===== */
const hasActivePlan = true   // cámbialo según tu estado real

/** ===== Política ===== */
const POLICY = {
  rewardPoints: 50,
  maxUsesPerCode: 5,
  cooldownHours: 24,
}

/** ===== Estado ===== */
const points = ref(120)
const level = ref(2)
const levelProgress = computed(() => (points.value % 200) / 200 * 100) // 200 pts por nivel (mock)

const activeCode = ref('')        // ej. "ENX-7KQ2P3"
const codeExpiresAt = ref(null)   // Date | null
const lastGeneratedAt = ref(null) // Date | null
const cooldownMsg = ref('')

const referrals = ref([
  // estados: 'pending' (se registró), 'activated' (activó plan), 'rewarded' (ya se abonó)
  { id: 'r1', user: 'ana.p', code: 'ENX-1AB2C3', status: 'rewarded', date: '2025-09-01', points: 50 },
  { id: 'r2', user: 'mario.r', code: 'ENX-1AB2C3', status: 'activated', date: '2025-09-14', points: 0 },
  { id: 'r3', user: 'jose.l', code: 'ENX-4XY9W2', status: 'pending',  date: '2025-09-18', points: 0 },
])

const stats = computed(() => ({
  total: referrals.value.length,
  activated: referrals.value.filter(r => r.status === 'activated').length,
  rewarded: referrals.value.filter(r => r.status === 'rewarded').length,
}))

/** ===== Helpers ===== */
function randCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = 'ENX-'
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}
function formatDate(d) {
  const dt = new Date(d); return dt.toLocaleDateString()
}
const canGenerate = computed(() => {
  if (!hasActivePlan) return false
  if (activeCode.value) return false
  if (!lastGeneratedAt.value) return true
  const diffH = (Date.now() - lastGeneratedAt.value.getTime()) / 36e5
  if (diffH < POLICY.cooldownHours) {
    const remain = Math.max(0, POLICY.cooldownHours - diffH)
    const h = Math.floor(remain)
    const m = Math.round((remain - h) * 60)
    cooldownMsg.value = `${h}h ${m}m`
    return false
  }
  cooldownMsg.value = ''
  return true
})
const expiresAtHuman = computed(() =>
    codeExpiresAt.value ? new Date(codeExpiresAt.value).toLocaleString() : ''
)
function labelStatus(s) {
  return s === 'pending' ? 'Pendiente'
      : s === 'activated' ? 'Activado'
          : 'Recompensado'
}

/** ===== Acciones ===== */
function generateCode() {
  if (!canGenerate.value) return
  activeCode.value = randCode()
  codeExpiresAt.value = new Date(Date.now() + 24 * 3600 * 1000) // 24h
  lastGeneratedAt.value = new Date()

}
function copyCode() {
  navigator.clipboard?.writeText(activeCode.value)
}
function shareLink() {
  const link = `${location.origin}/signup?ref=${activeCode.value}`
  if (navigator.share) {
    navigator.share({ title: 'Únete a Energix', text: 'Regístrate con mi código:', url: link })
  } else {
    navigator.clipboard?.writeText(link)
    alert('Enlace copiado: ' + link)
  }
}
function revokeCode() {
  activeCode.value = ''
  codeExpiresAt.value = null
}
function rewardReferrer(id) {
  const r = referrals.value.find(x => x.id === id)
  if (!r || r.status !== 'activated') return
  r.status = 'rewarded'
  r.points = POLICY.rewardPoints
  points.value += POLICY.rewardPoints

}
</script>

<style scoped>
:root{
  --navy:#0e2c4a;
  --navy-hover:#0b2239;
  --ink:#0f172a;
  --muted:#6b7280;
  --border:#e5e7eb;
  --blue-soft:#e7eff9;
  --blue-soft-border:#bfd4f3;
  --card-radius:14px;
  --shadow:0 2px 10px rgba(0,0,0,.06);
}

.wrap{padding:32px;background:#f9fafb;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.title{margin:0;color:var(--ink);font-weight:800;font-size:1.8rem}
.subtitle{margin:6px 0 16px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{background:#fff;border:2px solid var(--border);border-radius:var(--card-radius);padding:16px 18px;box-shadow:var(--shadow)}
.kpi .points{font-size:28px;font-weight:800;color:var(--ink)}
.kpi .big{font-size:26px;font-weight:800;margin:2px 0}
.progress{height:8px;background:#eef2ff;border-radius:12px;margin:10px 0 4px}
.progress .bar{height:100%;background:#001f49;border-radius:12px}
.bullets{margin:8px 0 0; padding-left:18px}
.muted{color:var(--muted)}
.small{font-size:.9rem}

.row{display:flex;gap:10px;align-items:center}
.between{justify-content:space-between}

.badge{background:#dbeafe;border:1px solid var(--blue-soft-border);color:#1e3a8a;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:600}

.code-box{display:flex;flex-direction:column;gap:10px;margin-top:8px}
.code{font-family:ui-monospace, SFMono-Regular, Menlo, monospace;background:#f1f5f9;border:1px dashed #cbd5e1;border-radius:8px;padding:8px 10px;display:inline-block;width:max-content}
.code-actions{display:flex;gap:8px;flex-wrap:wrap}
.no-code{display:flex;gap:12px;align-items:center;margin-top:4px}

.table{width:100%;border-collapse:collapse;margin-top:8px}
.table th,.table td{border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:left}
.actions-td{width:1%;white-space:nowrap}

.status{padding:2px 8px;border-radius:999px;font-size:12px;border:1px solid #e5e7eb}
.status.pending{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
.status.activated{background:#ecfeff;border-color:#a5f3fc;color:#155e75}
.status.rewarded{background:#ecfdf5;border-color:#bbf7d0;color:#166534}

.btn{border:none;border-radius:10px;padding:10px 14px;font-weight:600;cursor:pointer}
.btn.tiny{padding:6px 10px;border-radius:8px}
.btn-primary{background:#001f49;color:#fff}
.btn-primary:hover{background:#00163a}
.btn.outline{background:#fff;border:1px solid #cbd5e1;color:#0f172a}
.btn.danger{background:#dc2626;color:#fff}
.btn.danger:hover{background:#b91c1c}
</style>
