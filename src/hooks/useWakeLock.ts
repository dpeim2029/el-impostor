import { useEffect } from 'react'

/**
 * Evita que la pantalla se apague mientras el teléfono pasa de mano en mano.
 * Es "best effort": si el navegador no lo soporta, simplemente no hace nada.
 */
export function useWakeLock(activo: boolean) {
  useEffect(() => {
    if (!activo || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let cancelado = false

    const pedir = async () => {
      try {
        if (document.visibilityState !== 'visible') return
        sentinel = await navigator.wakeLock.request('screen')
      } catch {
        sentinel = null
      }
    }

    const alCambiarVisibilidad = () => {
      if (!cancelado && document.visibilityState === 'visible') void pedir()
    }

    void pedir()
    document.addEventListener('visibilitychange', alCambiarVisibilidad)

    return () => {
      cancelado = true
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      void sentinel?.release().catch(() => undefined)
    }
  }, [activo])
}
