import SwiftUI
import ImpostorCore

/// Enrutador: una pantalla por fase, sin pila de navegación (igual que App.tsx).
/// "Cómo se juega" es una hoja sobre el inicio, así que comparte pantalla con él.
struct RaizView: View {
    @Environment(JuegoStore.self) private var store
    @Environment(\.scenePhase) private var scenePhase

    private var faseVisual: Fase {
        store.estado.fase == .comoJugar ? .inicio : store.estado.fase
    }

    var body: some View {
        ZStack {
            FondoView()
            pantalla
                .id(faseVisual)
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .opacity
                ))
        }
        .animation(.snappy(duration: 0.3), value: faseVisual)
        .foregroundStyle(Color.tinta)
        .onChange(of: store.enJuego, initial: true) { _, enJuego in
            UIApplication.shared.isIdleTimerDisabled = enJuego
        }
        .onChange(of: scenePhase) { _, fase in
            if fase == .active {
                UIApplication.shared.isIdleTimerDisabled = store.enJuego
            }
        }
    }

    @ViewBuilder
    private var pantalla: some View {
        switch faseVisual {
        case .inicio, .comoJugar: InicioView()
        case .ajustes: AjustesView()
        case .reparto: RepartoView()
        case .ronda: RondaView()
        case .votacion: VotacionView()
        case .resultado: ResultadoView()
        }
    }
}

extension ErrorPartida {
    /// Texto para el jugador; el motor solo devuelve el caso.
    var mensaje: LocalizedStringKey {
        switch self {
        case .pocosJugadores: "Se necesitan al menos 3 jugadores."
        case .demasiadosJugadores: "Máximo 15 jugadores."
        case .nombreVacio: "Todos los jugadores necesitan un nombre."
        case .nombresRepetidos: "Hay nombres repetidos."
        case .dosImpostoresRequierenSeis: "Para 2 impostores se necesitan 6 jugadores o más."
        case .sinCategorias: "Elige al menos una categoría."
        }
    }
}

#Preview {
    RaizView()
        .environment(JuegoStore(banco: try! BancoPalabras.cargar(en: .main), almacen: AlmacenEnMemoria()))
        .preferredColorScheme(.light)
}
