import SwiftUI
import ImpostorCore

/// Nueva partida: lista agrupada nativa (jugadores reordenables, impostores, categorías).
struct AjustesView: View {
    @Environment(JuegoStore.self) private var store
    @State private var elegirCategorias = false
    @State private var nuevoNombre = ""
    @FocusState private var campoNuevoEnfocado: Bool

    private var jugadores: [Jugador] { store.estado.jugadores }
    private var ajustes: Ajustes { store.estado.ajustes }
    private var lleno: Bool { jugadores.count >= Reglas.maxJugadores }
    private var nombreLimpio: String { nuevoNombre.trimmingCharacters(in: .whitespacesAndNewlines) }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("Nueva partida")
                        .font(.system(size: Tipografia.escalado(34, como: .largeTitle), weight: .black))
                        .textCase(.uppercase)
                        .tracking(-1)
                        .foregroundStyle(Color.tinta)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 0, leading: 4, bottom: 0, trailing: 0))
                        .listRowSeparator(.hidden)
                        .accessibilityAddTraits(.isHeader)
                        .accessibilityIdentifier("tituloNuevaPartida")
                }
                .listSectionSpacing(0)
                seccionJugadores
                seccionImpostores
                seccionCategorias
            }
            .listStyle(.insetGrouped)
            .listRowSeparator(.hidden)
            .scrollContentBackground(.hidden)
            .background(Color.papel)
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarTitleDisplayMode(.inline)
            .toolbar(.visible, for: .navigationBar)
            .toolbarBackground(.hidden, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { store.enviar(.ir(.inicio)) } label: {
                        Image(systemName: "chevron.left")
                    }
                    .accessibilityLabel("Regresar")
                    .accessibilityIdentifier("regresar")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    if jugadores.count > 1 {
                        EditButton()
                    }
                }
            }
            .safeAreaBar(edge: .bottom) {
                pie
            }
        }
        .tint(.tinta)
        .onAppear {
            elegirCategorias = Set(ajustes.categoriasActivas) != Set(store.idsPorDefecto)
        }
    }

    // MARK: Pie

    private var pie: some View {
        let validacion = store.validacion
        return VStack(spacing: 8) {
            if !validacion.valido, !jugadores.isEmpty, let primero = validacion.errores.first {
                Text(primero.mensaje)
                    .font(.apoyo)
                    .foregroundStyle(Color.textoSecundario)
                    .multilineTextAlignment(.center)
            }
            Button("Repartir cartas") { store.enviar(.repartir) }
                .buttonStyle(.primario)
                .disabled(!validacion.valido)
                .accessibilityIdentifier("repartirCartas")
        }
        .padding(.horizontal, 22)
        .padding(.top, 10)
        .padding(.bottom, 6)
        .frame(maxWidth: .infinity)
        .background(Color.papel)
    }

    // MARK: Jugadores

    private var seccionJugadores: some View {
        Section {
            ForEach(Array(jugadores.enumerated()), id: \.element.id) { indice, jugador in
                FilaJugadorView(jugador: jugador, posicion: indice + 1) { nombre in
                    store.enviar(.renombrarJugador(id: jugador.id, nombre: nombre))
                }
                .listRowBackground(FondoDeSeccion(marco: .lila, posicion: .de(indice: indice, total: jugadores.count + (lleno ? 0 : 1))))
            }
            .onDelete { offsets in
                for indice in offsets.sorted(by: >) where jugadores.indices.contains(indice) {
                    store.enviar(.quitarJugador(id: jugadores[indice].id))
                }
            }
            .onMove(perform: mover)

            if !lleno {
                HStack(spacing: 12) {
                    Button(action: agregar) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 26))
                            .foregroundStyle(Color.tinta)
                    }
                    .buttonStyle(.plain)
                    .disabled(nombreLimpio.isEmpty)
                    .accessibilityLabel("Agregar")
                    .accessibilityIdentifier("agregarJugador")
                    TextField("Agregar jugador", text: $nuevoNombre)
                        .font(.cuerpo)
                        .textInputAutocapitalization(.words)
                        .autocorrectionDisabled()
                        .submitLabel(.done)
                        .focused($campoNuevoEnfocado)
                        .onSubmit(agregar)
                        .onChange(of: nuevoNombre) { _, nuevo in
                            if nuevo.count > 20 { nuevoNombre = String(nuevo.prefix(20)) }
                        }
                        .accessibilityIdentifier("nombreJugador")
                }
                .listRowBackground(FondoDeSeccion(marco: .lila, posicion: .de(indice: jugadores.count, total: jugadores.count + 1)))
            }
        } header: {
            EncabezadoDeSeccion(texto: "Jugadores")
        } footer: {
            if lleno {
                Text("Máximo 15 jugadores.")
            } else if jugadores.count > 1 {
                Text("El orden de la lista es el orden en que están sentados.")
            }
        }
    }

    private func agregar() {
        guard !nombreLimpio.isEmpty else { return }
        store.enviar(.agregarJugador(nombre: nuevoNombre))
        nuevoNombre = ""
        campoNuevoEnfocado = true
    }

    /// El reductor mueve de uno en uno; una arrastrada larga se traduce en varios pasos.
    private func mover(desde origenes: IndexSet, hacia destinoBruto: Int) {
        guard let origen = origenes.first else { return }
        let destino = destinoBruto > origen ? destinoBruto - 1 : destinoBruto
        guard destino != origen, jugadores.indices.contains(origen) else { return }
        let id = jugadores[origen].id
        let direccion = destino > origen ? 1 : -1
        for _ in 0..<abs(destino - origen) {
            store.enviar(.moverJugador(id: id, direccion: direccion))
        }
    }

    // MARK: Impostores

    private var seccionImpostores: some View {
        let permiteDos = store.permiteDosImpostores
        let seleccion = Binding<NumImpostores>(
            get: { ajustes.numImpostores },
            set: { store.enviar(.setNumImpostores($0)) }
        )
        return Section {
            HStack {
                Text("Cuántos")
                    .font(.cuerpo)
                Spacer()
                Picker("Impostores", selection: seleccion) {
                    Text("1").tag(NumImpostores.uno)
                    Text("2").tag(NumImpostores.dos)
                }
                .pickerStyle(.segmented)
                .frame(width: 120)
                .disabled(!permiteDos)
                .accessibilityIdentifier("impostores")
            }
            .listRowBackground(FondoDeSeccion(marco: .durazno, posicion: .unica))
        } header: {
            EncabezadoDeSeccion(texto: "Impostores")
        } footer: {
            if !permiteDos {
                Text("2 impostores a partir de \(Reglas.minJugadoresDosImpostores) jugadores.")
            }
        }
    }

    // MARK: Categorías

    private var seccionCategorias: some View {
        Section {
            Toggle("Elegir categorías", isOn: $elegirCategorias.animation(.snappy(duration: 0.25)))
                .font(.cuerpo)
                .tint(.tinta)
                .accessibilityIdentifier("elegirCategorias")
                .onChange(of: elegirCategorias) { _, activo in
                    if !activo { store.enviar(.setCategorias(ids: store.idsPorDefecto)) }
                }
                .listRowBackground(FondoDeSeccion(marco: .amarillo, posicion: .primera))
            if elegirCategorias {
                ForEach(Array(store.categorias.enumerated()), id: \.element.id) { indice, categoria in
                    let activa = ajustes.categoriasActivas.contains(categoria.id)
                    Button {
                        store.enviar(.toggleCategoria(id: categoria.id))
                    } label: {
                        HStack(spacing: 12) {
                            Text(categoria.emoji)
                                .font(.system(size: 22))
                            Text(categoria.nombre)
                                .font(.cuerpo)
                                .foregroundStyle(Color.tinta)
                            Spacer()
                            if activa {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundStyle(Color.tinta)
                            }
                        }
                        .contentShape(.rect)
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(activa ? [.isSelected] : [])
                    .listRowBackground(FondoDeSeccion(marco: .amarillo, posicion: indice == store.categorias.count - 1 ? .ultima : .media))
                }
            } else {
                Text("Todas las categorías")
                    .font(.cuerpo)
                    .foregroundStyle(Color.textoSecundario)
                    .listRowBackground(FondoDeSeccion(marco: .amarillo, posicion: .ultima))
            }
        } header: {
            EncabezadoDeSeccion(texto: "Categorías")
        } footer: {
            if elegirCategorias {
                Text("\(ajustes.categoriasActivas.count) de \(store.categorias.count) activas")
            }
        }
    }
}

/// Fila de jugador: número y nombre editable en el lugar (como en Recordatorios).
struct FilaJugadorView: View {
    var jugador: Jugador
    var posicion: Int
    var alRenombrar: (String) -> Void

    @State private var borrador: String
    @FocusState private var enfocado: Bool

    init(jugador: Jugador, posicion: Int, alRenombrar: @escaping (String) -> Void) {
        self.jugador = jugador
        self.posicion = posicion
        self.alRenombrar = alRenombrar
        _borrador = State(initialValue: jugador.nombre)
    }

    var body: some View {
        HStack(spacing: 12) {
            NumeroCirculo(numero: posicion, tamano: 26, relleno: .lila, color: .tinta)
            TextField("Nombre", text: $borrador)
                .font(.cuerpo)
                .textInputAutocapitalization(.words)
                .autocorrectionDisabled()
                .submitLabel(.done)
                .focused($enfocado)
                .onSubmit(guardar)
                .onChange(of: enfocado) { _, tiene in
                    if !tiene { guardar() }
                }
                .onChange(of: jugador.nombre) { _, nuevo in
                    if !enfocado { borrador = nuevo }
                }
                .onChange(of: borrador) { _, nuevo in
                    if nuevo.count > 20 { borrador = String(nuevo.prefix(20)) }
                }
                .accessibilityLabel("Nombre de \(jugador.nombre)")
                .accessibilityIdentifier("jugador-\(jugador.nombre)")
        }
    }

    private func guardar() {
        let limpio = borrador.trimmingCharacters(in: .whitespacesAndNewlines)
        if limpio.isEmpty {
            borrador = jugador.nombre
        } else if limpio != jugador.nombre {
            alRenombrar(limpio)
        }
    }
}
