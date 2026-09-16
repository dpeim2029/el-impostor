import { useJuego } from '@/game/JuegoContext'
import { JuegoProvider } from '@/game/JuegoProvider'
import { useWakeLock } from '@/hooks/useWakeLock'
import { Ajustes } from '@/screens/Ajustes'
import { ComoJugar } from '@/screens/ComoJugar'
import { Inicio } from '@/screens/Inicio'
import { Reparto } from '@/screens/Reparto'
import { Resultado } from '@/screens/Resultado'
import { Ronda } from '@/screens/Ronda'
import { Votacion } from '@/screens/Votacion'

function Enrutador() {
  const { estado } = useJuego()
  const enJuego = estado.ronda !== null && estado.fase !== 'ajustes' && estado.fase !== 'inicio'
  useWakeLock(enJuego)

  switch (estado.fase) {
    case 'inicio':
      return <Inicio />
    case 'como-jugar':
      return <ComoJugar />
    case 'ajustes':
      return <Ajustes />
    case 'reparto':
      return <Reparto />
    case 'ronda':
      return <Ronda />
    case 'votacion':
      return <Votacion />
    case 'resultado':
      return <Resultado />
  }
}

export default function App() {
  return (
    <JuegoProvider>
      <Enrutador />
    </JuegoProvider>
  )
}
