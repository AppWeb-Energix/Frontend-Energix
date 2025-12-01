// src/personalization/infrastructure/personalization.endpoint.js
import { http } from '@/shared/infrastructure/base-api.js'

const PERSONALIZATION_PATH = import.meta.env.VITE_PERSONALIZATION_ENDPOINT_PATH || '/personalization'

export const PersonalizationAPI = {
  /**
   * Obtiene la personalización por userId
   * Backend endpoint: GET /api/v1/personalization/{userId}
   */
  async getByUserId(userId) {
    try {
      const response = await http.get(`${PERSONALIZATION_PATH}/${userId}`)
      return response
    } catch (error) {
      // Si retorna 404, significa que no existe personalización para ese usuario
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Crea una nueva personalización
   * Backend endpoint: POST /api/v1/personalization
   */
  async create(data) {
    return await http.post(PERSONALIZATION_PATH, data)
  },

  /**
   * Actualiza la personalización por userId
   * Backend endpoint: PUT /api/v1/personalization/{userId}
   */
  async update(userId, data) {
    const fullData = { userId, ...data }
    return await http.put(`${PERSONALIZATION_PATH}/${userId}`, fullData)
  },

  /**
   * Elimina la personalización por userId
   * Backend endpoint: DELETE /api/v1/personalization/{userId}
   */
  async delete(userId) {
    return await http.delete(`${PERSONALIZATION_PATH}/${userId}`)
  },

  /**
   * Guarda (crea o actualiza) la personalización de un usuario
   */
  async saveUserPersonalization(userId, data) {
    const existing = await this.getByUserId(userId)

    if (existing) {
      return this.update(userId, data)
    } else {
      return this.create({ userId, ...data })
    }
  }
}

