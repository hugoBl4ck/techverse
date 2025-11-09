import { ref } from 'vue'

const tenant = ref(null)

export function useTenant() {
  const setTenant = (newTenant) => {
    tenant.value = newTenant
  }

  return {
    tenant,
    setTenant,
  }
}
