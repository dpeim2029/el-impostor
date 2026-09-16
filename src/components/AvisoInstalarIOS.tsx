import { Share, SquarePlus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const CLAVE = 'el-impostor:aviso-ios-oculto'

function esIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const esDispositivoApple = /iPhone|iPad|iPod/.test(ua)
  // iPadOS se presenta como Mac, pero con pantalla táctil.
  const esIPadMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  return esDispositivoApple || esIPadMac
}

function yaInstalada(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}

/** Safari en iPhone no ofrece instalar la app solo: hay que decirle a la gente cómo. */
export function AvisoInstalarIOS() {
  const [oculto, setOculto] = useState(() => {
    try {
      return localStorage.getItem(CLAVE) === '1'
    } catch {
      return false
    }
  })

  if (oculto || !esIOS() || yaInstalada()) return null

  const cerrar = () => {
    setOculto(true)
    try {
      localStorage.setItem(CLAVE, '1')
    } catch {
      // Sin almacenamiento: solo se oculta en esta visita.
    }
  }

  return (
    <div className="relative rounded-2xl border border-primary/30 bg-primary/10 p-4 pr-10 text-sm">
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        onClick={cerrar}
        aria-label="Cerrar aviso"
      >
        <X />
      </Button>
      <p className="font-semibold">Agrégalo a tu pantalla de inicio</p>
      <p className="mt-1 text-muted-foreground">
        Así se abre como app, a pantalla completa y sin internet. En Safari toca{' '}
        <Share className="inline size-4 align-text-bottom" aria-label="Compartir" /> Compartir y
        luego{' '}
        <SquarePlus className="inline size-4 align-text-bottom" aria-hidden="true" /> «Agregar a
        pantalla de inicio».
      </p>
    </div>
  )
}
