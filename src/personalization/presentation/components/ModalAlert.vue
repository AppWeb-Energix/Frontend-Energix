<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <p class="modal-message">{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-button" @click="closeModal">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('')
const message = ref('')
const buttonText = ref('Aceptar')

const show = (titleText, messageText, btnText = 'Aceptar') => {
  title.value = titleText
  message.value = messageText
  buttonText.value = btnText
  isVisible.value = true
}

const closeModal = () => {
  isVisible.value = false
}

defineExpose({
  show,
  closeModal
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(219, 234, 254, 0.6);
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(-40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 28px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-bottom: none;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 36px 28px;
  background: linear-gradient(to bottom, #ffffff 0%, #f3f4f6 100%);
}

.modal-message {
  font-size: 16px;
  color: #374151;
  line-height: 1.8;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.modal-footer {
  padding: 24px 28px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f9fafb;
}

.modal-button {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.modal-button:hover {
  background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(17, 24, 39, 0.3);
}

.modal-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.25);
}
</style>

