import { ref } from 'vue'

// TEMPORARY FIX: Hardcoding tenant ID for development/testing.
// In a real application, this should be dynamically set after user login or store selection.
const tenant = ref('primeiraloja') 
console.warn('WARNING: Tenant ID is hardcoded in useTenant.js. This should be dynamically set in production.')

export function useTenant() {
  const setTenant = (newTenant) => {
    tenant.value = newTenant
  }

  return {
    tenant,
    setTenant,
  }
}
