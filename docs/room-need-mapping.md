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
| **food** | Shelf (Snack-Bowl), MainPlant (Früchte) | Leere Schale, keine Früchte | Halbvolle Schale | Volle Schale, Früchte an Pflanze | Frucht-Erscheinung zusätzlich an glow gebunden |
| **energy** | Sun, Lamp (Helligkeit), Gesamtkontrast | Matte Sonne, flaues Bild | Normale Helligkeit | Strahlende Sonne, hoher Kontrast | Sun-Position via timeOfDay |
| **hygiene** | Floor (Flecken), Window (Schlieren) | Dreckflecken, milchige Scheibe | Sauber | Blitzblank, glänzend | Flecken-Dichte steigt exponentiell unter 30 |
| **social** | Pet | Traurig, versteckt, still | Neutral, sitzt | Fröhlich, hüpft, spielt | Pet-Animationen via Movement zusätzlich beeinflusst |
| **fun** | Aquarium, Bookshelf, Particles | Leer, wenige Fische | Teilweise bestückt | Viele Fische, volles Regal, bunte Partikel | |
| **comfort** | Shelf (Kissen), Lamp (Farbtemperatur) | Kaltes Licht, kein Kissen | Neutral | Warmes Licht, weiches Kissen | |
| **environment** | Wall (Farbe), Plants (Sättigung) | Grau, entsättigt, trüb | Normal | Sattes Grün, lebendig | Wand zusätzlich via timeOfDay |
| **movement** | Pet (Aktivität), Particles (Geschwindigkeit) | Still, träge | Normales Tempo | Aktiv, fließend, schnell | |
| **bathroom** | Carafe (auf Shelf) | Voll (100 - value) | Halb voll | Fast leer | **Invertiert!** `fill = 100 - needValue` |
| **glow (XP)** | Alle Deko-Elemente, Pflanzengröße, Partikel-Dichte | minimal | Standard | Maximaldetails | Schwellwerte: 20, 50, 80 |

## Design-Notizen

- **bathroom** nutzt invertierte Logik, weil niedriger Need = höhere Dringlichkeit = vollere Karaffe.
- Partikel-Typen wechseln mit `season` (Frühling=Blüten, Sommer=Glühwürmchen, Herbst=Blätter, Winter=Schnee).
- Die Tageszeit folgt echter Uhrzeit, wird aber visuell durch `energy` und `glow` überlagert.
