import SwiftUI
import ImpostorCore

/// Enrutador: una pantalla por fase, sin pila de navegación (igual que App.tsx).
struct RaizView: View {
    @Environment(JuegoStore.self) private var store
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ZStack {
            FondoView()
            pantalla
                .id(store.estado.fase)
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .opacity
                ))
        }
        .animation(.snappy(duration: 0.3), value: store.estado.fase)
        .foregroundStyle(Color.texto)
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
        switch store.estado.fase {
        case .inicio: InicioView()
        case .comoJugar: ComoJugarView()
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
        .preferredColorScheme(.dark)
        .fontDesign(.rounded)
}
