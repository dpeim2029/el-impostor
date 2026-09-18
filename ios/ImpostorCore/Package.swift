// swift-tools-version: 6.0
// Motor del juego: reglas, banco de palabras, roles, orden y voto.
// Solo Foundation. Sin UIKit ni SwiftUI para poder reutilizarlo en un servidor.
import PackageDescription

let package = Package(
    name: "ImpostorCore",
    platforms: [.iOS("26.0"), .macOS("15.0")],
    products: [
        .library(name: "ImpostorCore", targets: ["ImpostorCore"]),
    ],
    targets: [
        .target(
            name: "ImpostorCore",
            swiftSettings: [.swiftLanguageMode(.v6)]
        ),
        .testTarget(
            name: "ImpostorCoreTests",
            dependencies: ["ImpostorCore"],
            swiftSettings: [.swiftLanguageMode(.v6)]
        ),
    ]
)
