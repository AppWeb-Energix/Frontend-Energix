import { ref, computed } from 'vue'

// Estado global del usuario autenticado
const currentUser = ref(null)
const isAuthenticated = ref(false)

export function useAuth() {
  // Función para obtener el usuario desde localStorage
  const getCurrentUser = () => {
    try {
      // Leer usuario de localStorage (guardado por auth.service.js)
      const storedUser = localStorage.getItem('energix-user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        currentUser.value = user
        isAuthenticated.value = true
        return user
      }

      // Si no hay usuario almacenado, retornar null
      currentUser.value = null
      isAuthenticated.value = false
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      currentUser.value = null
      isAuthenticated.value = false
      return null
    }
  }

  // Función para establecer el usuario actual
  const setCurrentUser = (user, plan = null) => {
    currentUser.value = user
    isAuthenticated.value = !!user

    if (user) {
      // Guardar usuario en localStorage
      localStorage.setItem('energix-user', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')

      // Si se proporciona plan, guardarlo también
      if (plan) {
        localStorage.setItem('energix-plan', plan)
      }
    } else {
      // Limpiar localStorage
      localStorage.removeItem('energix-user')
      localStorage.removeItem('energix-plan')
      localStorage.setItem('isAuthenticated', 'false')
    }
  }

  // Función para logout
  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('energix-user')
    localStorage.removeItem('energix-plan')
    localStorage.removeItem('token')
    localStorage.setItem('isAuthenticated', 'false')
  }

  // Computed properties
  const userId = computed(() => currentUser.value?.id || null)

  const userPlan = computed(() => {
    const plan = localStorage.getItem('energix-plan')
    return plan || 'basic'
  })

  const userName = computed(() => {
    if (!currentUser.value) return 'Usuario'
    const { firstName, lastName } = currentUser.value
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || 'Usuario'
  })

  return {
    currentUser,
    isAuthenticated,
    userId,
    userPlan,
    userName,
    getCurrentUser,
    setCurrentUser,
    logout
  }
}
