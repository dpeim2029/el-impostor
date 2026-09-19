import SwiftUI
import ImpostorCore

@main
struct ElImpostorApp: App {
    @State private var store: JuegoStore

    init() {
        if ArgumentosDeDepuracion.reiniciar {
            UserDefaults.standard.removeObject(forKey: claveAlmacen)
        }
        let banco: BancoPalabras
        do {
            banco = try BancoPalabras.cargar(en: .main)
        } catch {
            fatalError("El banco de palabras no está en el bundle: \(error)")
        }
        let store = JuegoStore(banco: banco)
        if let destino = ArgumentosDeDepuracion.faseInicial {
            store.enviar(.ir(destino))
        }
        _store = State(initialValue: store)
    }

    var body: some Scene {
        WindowGroup {
            RaizView()
                .environment(store)
                .preferredColorScheme(.dark)
                .fontDesign(.rounded)
                .tint(.ambar)
        }
    }
}
