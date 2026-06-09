# Window Lottie Spec

Diese Datei ist die Handoff-Spec fuer Creator-Exports.
Die lokalen Platzhalter-JSONs in `assets/lottie/window/` duerfen spaeter 1:1 mit finalen Creator-Exports ueberschrieben werden.

## Motion Direction

- Personality: playful, aber ruhiger als das Pet
- Stimmung: warm, wettergetrieben, beruhigend statt hektisch
- Gleiche Artboard-Groesse fuer alle Clips: `270x60`
- Transparenter Hintergrund ausserhalb des Fensterrahmens
- Identischer Bounding-Box- und Grounding-Vertrag fuer alle Clips

## Loop Clips

- `window-loop-storm`
  Wetter: schwerer Regen, dunkler Himmel, Blitzflackern
- `window-loop-rain`
  Wetter: stetiger Regen, dichte Wolken
- `window-loop-light-rain`
  Wetter: leichter Regen, ruhigere Wolken
- `window-loop-clearing`
  Wetter: wenige Tropfen, kleine Sonne
- `window-loop-partly-cloudy`
  Wetter: zwei Wolken, sanfte Sonnenatmung
- `window-loop-sunny`
  Wetter: sonnig, einzelne Wolke
- `window-loop-bright`
  Wetter: sehr hell, deutlicher Sonnenpuls
- `window-loop-perfect-flight`
  Wetter: klarster Himmel, Flugzeug als High-State-Akzent

## Export Rules

- Export as plain Lottie JSON
- Keep filenames exact
- Overwrite placeholder files in `assets/lottie/window/`
- Verify same frame position and size before replacing all clips
- Creator MCP ist aktuell nutzbar, aber lokale Repo-Exporte muessen weiter manuell aus Creator kopiert werden
