# Aquarium Lottie Spec

Diese Datei ist die Handoff-Spec fuer Creator-Exports.
Die lokalen Platzhalter-JSONs in `assets/lottie/aquarium/` duerfen spaeter 1:1 mit finalen Creator-Exports ueberschrieben werden.

## Motion Direction

- Personality: Playful
- Emotional target: cozy, curious, quietly delightful
- Primary motion: Fischschwarm und Wasserleben
- Secondary motion: Blasen, Algen-Sway, Korallen-Glow, Reflexe
- Ambient motion: sanfte Wasseratmung, langsamer Lichtdrift
- Einheitliche Artboard-Groesse fuer alle Clips: `90x45`
- Transparenter Hintergrund ausserhalb des Tanks
- Identischer Bounding-Box- und Anchor-Vertrag fuer alle Clips

## Loop Clips

- `aquarium-loop-empty-murky`
  Truebes Wasser, keine Fische, braune Algen, fast keine Bewegung
- `aquarium-loop-lonely`
  Ein ruhiger Fisch, klares Wasser, zwei gruenere Algen, kaum Parallax
- `aquarium-loop-sandy-pair`
  Zwei Fische, Sandboden, langsames Kreisen, sanfter Pflanzen-Sway
- `aquarium-loop-bubbly-pair`
  Wie sandy-pair plus aufsteigende Blasen und etwas mehr Leben
- `aquarium-loop-bloom-trio`
  Drei Fische, Pebbles, Blooms, aktiveres Schwimmen
- `aquarium-loop-reflective-trio`
  Wie bloom-trio plus langsamer Lichtreflex-Sweep an der Wasseroberflaeche
- `aquarium-loop-coral-school`
  Vier Fische, Koralle, Seepferdchen, mehrere Routen, lebendiger Tank
- `aquarium-loop-golden-school`
  Fuenf Fische, Glow-Koralle, Goldreflex, dicht und hochwertig, aber nicht chaotisch

## State Mapping

- `0`: trueb, leer, braune Algen, keine Bewegung
- `1`: ein Fisch, klares Wasser, ruhiger Loop
- `2`: zwei Fische, Sandboden, langsame Bewegung
- `3`: zwei Fische, Sand, Blasen, mittlere Bewegung
- `4`: drei Fische, Pebbles, Blooms, aktiv
- `5`: wie `4` plus Wasserreflex
- `6`: vier Fische, Koralle, Seepferdchen, mehrere Schwimmbahnen
- `7`: fuenf Fische, Glow-Koralle, Goldreflex, lebendigster Zustand

## Export Rules

- Export as plain Lottie JSON
- Keep filenames exact
- Overwrite placeholder files in `assets/lottie/aquarium/`
- Verify same frame position and size before replacing all clips
- Jede Scene in Creator bleibt ein kompletter Tank, kein modulares Clip-System
- Creator MCP ist der Authoring-Weg; der Repo-Handoff bleibt manuell per JSON-Export
