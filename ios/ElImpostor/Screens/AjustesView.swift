import SwiftUI
import ImpostorCore

struct AjustesView: View {
    @Environment(JuegoStore.self) private var store
    @State private var elegirCategorias = false

    private var jugadores: [Jugador] { store.estado.jugadores }
    private var ajustes: Ajustes { store.estado.ajustes }

    var body: some View {
        Pantalla(titulo: "Nueva partida", alRegresar: { store.enviar(.ir(.inicio)) }) {
            seccionJugadores
            seccionImpostores
            seccionCategorias
        } pie: {
            let validacion = store.validacion
            if !validacion.valido, !jugadores.isEmpty, let primero = validacion.errores.first {
                Text(primero.mensaje)
                    .font(.apoyo)
                    .foregroundStyle(Color.textoApagado)
                    .multilineTextAlignment(.center)
            }
            Button("Repartir cartas") { store.enviar(.repartir) }
                .buttonStyle(.primario)
                .disabled(!validacion.valido)
                .accessibilityIdentifier("repartirCartas")
        }
        .onAppear {
            elegirCategorias = ajustes.categoriasActivas.count != store.categorias.count
        }
    }

    // MARK: Jugadores

    private var seccionJugadores: some View {
        Seccion(titulo: "Jugadores", detalle: jugadores.isEmpty ? nil : "\(jugadores.count)") {
            FormularioJugadorView(deshabilitado: jugadores.count >= Reglas.maxJugadores) { nombre in
                store.enviar(.agregarJugador(nombre: nombre))
            }
            if !jugadores.isEmpty {
                VStack(spacing: 8) {
                    ForEach(Array(jugadores.enumerated()), id: \.element.id) { indice, jugador in
                        FilaJugadorView(
                            jugador: jugador,
                            posicion: indice + 1,
                            esPrimero: indice == 0,
                            esUltimo: indice == jugadores.count - 1,
                            alRenombrar: { store.enviar(.renombrarJugador(id: jugador.id, nombre: $0)) },
                            alMover: { store.enviar(.moverJugador(id: jugador.id, direccion: $0)) },
                            alQuitar: { store.enviar(.quitarJugador(id: jugador.id)) }
                        )
                    }
                }
                .animation(.snappy(duration: 0.25), value: jugadores.map(\.id))
            }
        }
    }

    // MARK: Impostores

    private var seccionImpostores: some View {
        Seccion(titulo: "Impostores") {
            let permiteDos = store.permiteDosImpostores
            HStack(spacing: 8) {
                ForEach(NumImpostores.allCases, id: \.self) { n in
                    let activo = ajustes.numImpostores == n
                    let deshabilitado = n == .dos && !permiteDos
                    Button {
                        store.enviar(.setNumImpostores(n))
                    } label: {
                        Text("\(n.rawValue)")
                            .font(.fila)
                            .foregroundStyle(activo ? Color.ambarTexto : Color.texto)
                            .frame(maxWidth: .infinity)
                            .frame(minHeight: 48)
                            .tarjeta(
                                relleno: activo ? Color.ambar : Color.tarjeta.opacity(0.7),
                                borde: activo ? Color.ambar : Color.borde,
                                radio: 16
                            )
                    }
                    .buttonStyle(.plain)
                    .disabled(deshabilitado)
                    .opacity(deshabilitado ? 0.4 : 1)
                    .accessibilityLabel("\(n.rawValue) impostores")
                    .accessibilityAddTraits(activo ? [.isSelected] : [])
                    .accessibilityIdentifier("impostores\(n.rawValue)")
                }
            }
            .animation(.snappy(duration: 0.2), value: ajustes.numImpostores)
            if !permiteDos {
                Text("2 impostores a partir de \(Reglas.minJugadoresDosImpostores) jugadores.")
                    .font(.apoyo)
                    .foregroundStyle(Color.textoApagado)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }

    // MARK: Categorías

    private var seccionCategorias: some View {
        Seccion(
            titulo: "Categorías",
            detalle: elegirCategorias ? "\(ajustes.categoriasActivas.count) de \(store.categorias.count)" : "Todas"
        ) {
            Toggle("Elegir categorías", isOn: $elegirCategorias.animation(.snappy(duration: 0.25)))
                .labelsHidden()
                .tint(.ambar)
                .accessibilityIdentifier("elegirCategorias")
                .onChange(of: elegirCategorias) { _, activo in
                    if !activo { store.enviar(.setCategorias(ids: store.banco.idsDeCategorias)) }
                }
        } contenido: {
            if elegirCategorias {
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)], spacing: 8) {
                    ForEach(store.categorias) { categoria in
                        let activa = ajustes.categoriasActivas.contains(categoria.id)
                        Button {
                            store.enviar(.toggleCategoria(id: categoria.id))
                        } label: {
                            HStack(spacing: 8) {
                                Text(categoria.emoji)
                                    .font(.system(size: 24))
                                Text(categoria.nombre)
                                    .font(.apoyo.weight(.semibold))
                                    .lineLimit(1)
                                    .minimumScaleFactor(0.8)
                                    .foregroundStyle(activa ? Color.texto : Color.textoApagado)
                                Spacer(minLength: 0)
                            }
                            .padding(.horizontal, 12)
                            .frame(minHeight: 56)
                            .tarjeta(
                                relleno: activa ? Color.ambar.opacity(0.15) : Color.tarjeta.opacity(0.4),
                                borde: activa ? Color.ambar.opacity(0.6) : Color.borde,
                                radio: 16
                            )
                        }
                        .buttonStyle(.plain)
                        .accessibilityAddTraits(activa ? [.isSelected] : [])
                    }
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
}

/// Bloque con título, detalle gris y control opcional a la derecha.
struct Seccion<Accion: View, Contenido: View>: View {
    var titulo: LocalizedStringKey
    var detalle: String?
    @ViewBuilder var accion: () -> Accion
    @ViewBuilder var contenido: () -> Contenido

    init(
        titulo: LocalizedStringKey,
        detalle: String? = nil,
        @ViewBuilder accion: @escaping () -> Accion = { EmptyView() },
        @ViewBuilder contenido: @escaping () -> Contenido
    ) {
        self.titulo = titulo
        self.detalle = detalle
        self.accion = accion
        self.contenido = contenido
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .center, spacing: 8) {
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(titulo)
                        .font(.seccion)
                    if let detalle {
                        Text(detalle)
                            .font(.apoyo.weight(.medium))
                            .foregroundStyle(Color.textoApagado)
                    }
                }
                Spacer()
                accion()
            }
            .frame(minHeight: 32)
            contenido()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// Campo para agregar un jugador con botón de más.
struct FormularioJugadorView: View {
    var deshabilitado: Bool
    var alAgregar: (String) -> Void

    @State private var nombre = ""
    @FocusState private var enfocado: Bool

    private var limpio: String { nombre.trimmingCharacters(in: .whitespacesAndNewlines) }

    var body: some View {
        HStack(spacing: 8) {
            TextField("Nombre", text: $nombre)
                .font(.cuerpo)
                .textInputAutocapitalization(.words)
                .autocorrectionDisabled()
                .submitLabel(.done)
                .focused($enfocado)
                .onSubmit(agregar)
                .onChange(of: nombre) { _, nuevo in
                    if nuevo.count > 20 { nombre = String(nuevo.prefix(20)) }
                }
                .padding(.horizontal, 16)
                .frame(minHeight: 48)
                .tarjeta(relleno: Color.tarjeta.opacity(0.7), borde: Color.borde, radio: 16)
                .disabled(deshabilitado)
                .accessibilityIdentifier("nombreJugador")
            Button(action: agregar) {
                Image(systemName: "plus")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(Color.ambarTexto)
                    .frame(width: 48, height: 48)
                    .background(Color.ambar, in: .rect(cornerRadius: 16))
            }
            .buttonStyle(.plain)
            .disabled(deshabilitado || limpio.isEmpty)
            .opacity(deshabilitado || limpio.isEmpty ? 0.4 : 1)
            .accessibilityLabel("Agregar")
            .accessibilityIdentifier("agregarJugador")
        }
    }

    private func agregar() {
        guard !limpio.isEmpty else { return }
        alAgregar(nombre)
        nombre = ""
        enfocado = true
    }
}

/// Fila de jugador: número, nombre editable al tocarlo, subir/bajar/quitar.
struct FilaJugadorView: View {
    var jugador: Jugador
    var posicion: Int
    var esPrimero: Bool
    var esUltimo: Bool
    var alRenombrar: (String) -> Void
    var alMover: (Int) -> Void
    var alQuitar: () -> Void

    @State private var editando = false
    @State private var borrador = ""
    @FocusState private var enfocado: Bool

    var body: some View {
        HStack(spacing: 4) {
            NumeroCirculo(numero: posicion)
                .padding(.trailing, 4)
            if editando {
                TextField("Nombre", text: $borrador)
                    .font(.cuerpo.weight(.medium))
                    .textInputAutocapitalization(.words)
                    .autocorrectionDisabled()
                    .submitLabel(.done)
                    .focused($enfocado)
                    .onSubmit(guardar)
                    .onChange(of: enfocado) { _, tiene in
                        if !tiene { guardar() }
                    }
                    .onChange(of: borrador) { _, nuevo in
                        if nuevo.count > 20 { borrador = String(nuevo.prefix(20)) }
                    }
                    .accessibilityLabel("Editar nombre")
            } else {
                Button {
                    borrador = jugador.nombre
                    editando = true
                    enfocado = true
                } label: {
                    Text(jugador.nombre)
                        .font(.cuerpo.weight(.medium))
                        .lineLimit(1)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .contentShape(.rect)
                }
                .buttonStyle(.plain)
                .accessibilityHint("Toca para editar el nombre")
                .accessibilityIdentifier("jugador-\(jugador.nombre)")
            }
            Button { alMover(-1) } label: { Image(systemName: "chevron.up") }
                .buttonStyle(.iconoPlano)
                .disabled(esPrimero)
                .accessibilityLabel("Subir a \(jugador.nombre)")
            Button { alMover(1) } label: { Image(systemName: "chevron.down") }
                .buttonStyle(.iconoPlano)
                .disabled(esUltimo)
                .accessibilityLabel("Bajar a \(jugador.nombre)")
            Button(action: alQuitar) { Image(systemName: "xmark") }
                .buttonStyle(.iconoPlano)
                .accessibilityLabel("Quitar a \(jugador.nombre)")
        }
        .padding(.leading, 12)
        .padding(.trailing, 6)
        .frame(minHeight: 52)
        .tarjeta(radio: 16)
    }

    private func guardar() {
        guard editando else { return }
        editando = false
        let limpio = borrador.trimmingCharacters(in: .whitespacesAndNewlines)
        if !limpio.isEmpty, limpio != jugador.nombre {
            alRenombrar(borrador)
        }
    }
}
