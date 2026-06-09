# Room Scene — Need↔Object Mapping

Jedes Objekt im Wohnzimmer reagiert auf ein oder mehrere Need-Felder.
Alle Werte sind 0–100, es sei denn, es ist anders vermerkt.

## Steuerungsparameter

| Parameter | Quelle | Bereich | Beschreibung |
|-----------|--------|---------|-------------|
| `needValues` | arithm. Mittel der aktiven Needs | 0–100 | Durchschnittliches Wohlbefinden |
| `glow` | `useCareStore.glow` | 0–100+ | Kumulierte Care-Punkte (XP) |
| `timeOfDay` | `new Date().getHours()` | 8 Stufen | Echtzeit |

## Objekt-Mapping

| Need | Objekt(e) | Low (<30) | Medium (30–70) | High (>70) | Details |
|------|-----------|-----------|----------------|------------|---------|
| **hydration** | MainPlant, HangingPlant | Hängend, braune Blattspitzen | Normal grün | Saftig, aufrecht, Tau-Perlen | Pflanzen wachsen auch mit glow |
| **food** | Table (Snack-Bowl), MainPlant (Früchte) | Leere Schale, keine Früchte | Halbvolle Schale | Volle Schale, Früchte an Pflanze | Frucht-Erscheinung zusätzlich an glow gebunden |
| **energy** | Sun, Lamp (Helligkeit), Gesamtkontrast | Matte Sonne, flaues Bild | Normale Helligkeit | Strahlende Sonne, hoher Kontrast | Sun-Position via timeOfDay |
| **hygiene** | Floor (Flecken) | Dreckflecken | Sauber | Blitzblank, glänzend | Flecken-Dichte steigt exponentiell unter 30 |
| **social** | Pet | **State 0**: zitternde Kugel, X-Augen | **State 1–2**: sitzt klein (Ohren hängend/wedelt) | **State 3–7**: idle/hop/play (Pfoten, Tail, Herz) | 8 States: social×movement×glow, 2D-Grid |
| | | `pet-loop-hide` | `pet-loop-sit-small` / `pet-loop-sit-wag` | `pet-loop-idle` bis `pet-loop-play` | Renderer ist jetzt Lottie-only |
| **fun** | Aquarium, Bookshelf, Particles | Leer, wenige Fische | Teilweise bestückt | Viele Fische, volles Regal, bunte Partikel | |
| **comfort** | Table (Kissen), Lamp (Farbtemperatur) | Kaltes Licht, kein Kissen | Neutral | Warmes Licht, weiches Kissen | |
| **environment** | Wall (Farbe), Plants (Sättigung) | Grau, entsättigt, trüb | Normal | Sattes Grün, lebendig | Wand zusätzlich via timeOfDay |
| **movement** | Pet (Aktivität), Particles (Geschwindigkeit) | Still, träge | Normales Tempo | Aktiv, fließend, schnell | |
| **bathroom** | Carafe (auf Table) | Voll (100 - value) | Halb voll | Fast leer | **Invertiert!** `fill = 100 - needValue` |
| **glow (XP)** | Alle Deko-Elemente, Pflanzengröße, Partikel-Dichte | minimal | Standard | Maximaldetails | Schwellwerte: 20, 50, 80 |

## Design-Notizen

- **bathroom** nutzt invertierte Logik, weil niedriger Need = höhere Dringlichkeit = vollere Karaffe.
- `Window` ist jetzt Lottie-only und nutzt 8 diskrete Wetter-Loops ueber `averageValue x glowTier`, nicht ueber einen einzelnen Need.
- Partikel-Typen wechseln mit `season` (Frühling=Blüten, Sommer=Glühwürmchen, Herbst=Blätter, Winter=Schnee).
- Die Tageszeit folgt echter Uhrzeit, wird aber visuell durch `energy` und `glow` überlagert.
