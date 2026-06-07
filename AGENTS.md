# TinyCare Agent Instructions

## Expo SDK

- Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo-specific code.
- Use Yarn for project commands and dependency changes.
- Prefer Expo config plugins and app config over manual native edits.

## Mandatory Checks

- Every code or config change must pass `yarn verify` before handoff.
- If a change is narrow and `yarn verify` is too slow, at minimum run `yarn lint`, `yarn typecheck`, and `yarn test`; explain any skipped check explicitly.
- Do not claim a change is done if linting, typechecking, or tests are failing.

## Prebuild Compatibility

- All changes must be compatible with `expo prebuild` and must survive a clean prebuild.
- Treat `app.json`, `app.config.js`, Expo config plugins, package scripts, and source files as the source of truth.
- Do not put durable product behavior only in generated `ios/` or `android/` files.
- If native edits become unavoidable, document why, add or use a config plugin where practical, and verify with `yarn prebuild:clean`.
- Assume generated native folders may be deleted and regenerated at any time.

## Development Builds

- Native runtime features must be tested in development builds, not Expo Go, when they depend on native modules such as MMKV, notifications, Skia, dev client, or expo-updates.
- Android remains the first QA target; iOS compatibility still matters.

## Need↔Object Mapping (Room Scene)

- `docs/room-need-mapping.md` dokumentiert, welche Need-Werte welche Zimmer-Objekte visuell steuern.
- Bei jedem neuen Objekt oder geänderter Need-Abhängigkeit MUSS die Mapping-Tabelle aktualisiert werden.
- Bei `bathroom`→Carafe wird invertiert (100 - value), weil niedriger Need = höhere Dringlichkeit = vollere Karaffe.
