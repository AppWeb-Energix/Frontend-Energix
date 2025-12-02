 1. Eliminar llamadas POST a /api/v1/alerts:

  - En alerts.endpoint.js quita/ignora el método create/generateSystemAlert o no los uses.
  - En devices.vue (o donde se llame) elimina la invocación a generateSystemAlert después de crear/renombrar/eliminar dispositivos. Las
    alertas se generan en backend automáticamente.

  2. Ajustar visualización de alertas:

  - alerts.vue: en formatDate, soporta createdAt (camelCase) que devuelve el backend. Ejemplo:

    const d = alert.createdAt || alert.created_at;
    if (!d) return '';
    return new Date(d).toLocaleString();
  - Usar solo GET /api/v1/alerts para listar; no hay endpoint POST.

  3. Confirmar base URL:

  - Asegúrate de que base-api.js apunta a la URL de Render para /api/v1/alerts (no localhost cuando estés contra el deploy).

  Resultado esperado: desaparecerán el 405 (por POST inexistente) y el Invalid time value al formatear fechas.