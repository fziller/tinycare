# Room Component Improvement Plan

Jede Komponente bekommt **8+ visuelle Zustände** (4 Schwellwerte der primären Need × 2 Glow-Tiers oder Tageszeit).
Jeder State fügt **neue sichtbare Elemente** hinzu, nicht nur Skalierung existierender.

## Status-Legende

- **open** − noch nicht begonnen
- **in_progress** − wird gerade implementiert
- **done** − implementiert, getestet, `yarn verify` bestanden
- **blocked** − wartet auf Voraussetzung

---

## 1. Pet — `social × 4` + `movement × 2` = **8 States**

**Status: done**

**Need-Mapping:** `PetState = f(social, movement)`, 6×3-Raster, plus glow als Lever.

| State | social | movement | glow | Visual | Sub-Components | Neue Technik |
|-------|--------|----------|------|--------|---------------|--------------|
| 0 | <20 | beliebig | beliebig | **Hide** – zitternde Kugel, X-Augen | PetBody (.trembleX/Y), PetEye (.xEyed) | Reanimated SharedValue für bodyR, Tremor per useReanimatedSway |
| 1 | 20–40 | <30 | beliebig | **Sit small** – kleiner Körper, hängende Ohren | PetBody, PetEar(.rotate=-0.3), PetEye | useReanimatedNumeric für earAngle-Rotation |
| 2 | 20–40 | ≥30 | beliebig | **Sit wag** – sitzt, Schwanz wedelt | PetBody, PetEar, PetTail(.wagAngle) | PetTail mit useDerivedValue-Transform; useReanimatedSway für Schwanz |
| 3 | 40–65 | <40 | beliebig | **Idle** – normal, Ohren neutral, Pfoten | PetBody, PetEar, PetEye, PetTail, PetPaw×2, PetNose | PetPaw mit SharedValue-Position (pawLX/pawRX) |
| 4 | 40–65 | ≥40 | <2 | **Idle+** – normal + Fell-Glanz | PetBody(.glowHighlight), PetEar, PetTail, PetPaw, PetNose | Bedingtes Render des Highlight-Paths im PetBody |
| 5 | 40–65 | ≥40 | ≥2 | **Idle++** – normal + Glanz + Blinzeln | PetEye(.blinking), PetBody(.glowHighlight), PetTail | useBlink via setTimeout + React State; blink overlay line |
| 6 | >65 | 40–70 | beliebig | **Hop** – aufrecht, Ohren hoch, gestreckt | PetBody(.bodyScaleY=1.3), PetEar(.rotate=0.2), PetTail | useReanimatedNumeric für bodyScaleY |
| 7 | >65 | >70 | beliebig | **Play** – Körper groß + Herz + Nase leuchtet | PetHeart, PetNose(.noseGlow), PetBody, PetTail | PetHeart mit useDerivedValue-Float; RadialGradient auf Nase |

**Sub-Components (je eine Datei unter `src/components/room/pet/`):**
- `PetBody.tsx` – Ei-förmiger Körper (cubicTo-Path) + RadialGradient + BlurMask-Schatten + optionaler glowHighlight-Überzug
- `PetEar.tsx` – cubicTo-Katzenohr + transform (Position, Skalierung, Rotation via SharedValues)
- `PetEye.tsx` – offen/geschlossen via X-Overlay oder Circle + blink overlay (boolean < 1 Hz)
- `PetTail.tsx` – TAIL_PATH (cubicTo) + wagAngle via useDerivedValue-Transform
- `PetPaw.tsx` – PAW_PATH (cubicTo-Halbkreis) + dynamische Position via bodyR SharedValue
- `PetHeart.tsx` – HEART_PATH (cubicTo) + Float/Drift via useDerivedValue
- `PetNose.tsx` + `PetMouth.tsx` – Nase (Circle + RadialGradient) + Mund (cubicTo mood-Path via moodFromState)

**Hooks (je eine Datei unter `src/components/room/hooks/`):**
- `useReanimatedSway` – UI-thread Sinus-Animation via `useClock` + `useDerivedValue` (ersetzt alten `useSway` für neue Komponenten)
- `useReanimatedNumeric` – Smooth Value-Transition via `useSharedValue` + `useEffect` + `withTiming`

**Bausteine:**
- `buildBodyPath()` in `petShapes.ts` – 4×cubicTo Ei-Form, 20×28 units
- `TAIL_PATH` in `petShapes.ts` – 3×cubicTo geschwungener Schwanz
- `HEART_PATH` in `petShapes.ts` – 4×cubicTo Herz-Form
- `moodFromState(state)` in `petShapes.ts` – smile (≥6) / neutral (2–5) / sad (≤1)
- `useBlink(enabled)` – Boolean via setTimeout-Kette alle 3–7s + 150ms Close

---

## 2. HangingPlant — `glowTier × 4` + `hydration × 2` = **8 States**

**Status: open**

**Need-Mapping:** `HangingPlantState = f(glowTier, hydration)`, Blätter aus `leafShapes.ts`.

| State | glow | hyd | Blätter | Besonderheit |
|-------|------|-----|---------|-------------|
| 0 | <20 | <50 | 1 Baby-Blatt | Ranke kurz, Blatt braun (#C4A860), schlaff |
| 1 | <20 | ≥50 | 1 Baby-Blatt | Ranke kurz, Blatt grün (#93BD98), straff |
| 2 | 20–49 | <50 | 2 Small-Blätter | Ranke mittel, Blätter gelbgrün (#93C490) |
| 3 | 20–49 | ≥50 | 2 Small-Blätter | Saftig grün, leichter Sway pro Blatt |
| 4 | 50–79 | <50 | 4 (2 Small + 2 Full) | Adern sichtbar, Ranke lang |
| 5 | 50–79 | ≥50 | 4 (2 Small + 2 Full) | Adern + Tau-Perlen (weiße Kreise, opacity 0.4) |
| 6 | ≥80 | <50 | 6 Full-Blätter | Adern + Blütenknospen (kleine rosa Ellipsen) |
| 7 | ≥80 | ≥50 | 6 Full-Blätter | Adern + Blüten + Glanz + Sway pro Blatt |

**Bausteine:**
- Ranke: `Stamm` aus `MainPlant`-Struktur → `moveTo + cubicTo` von Topf bis erstes Blatt
- Blätter: `getLeafPaths(type, size)` aus `leafShapes.ts` (bisher nur `<Circle>`)
- Sway: `useSway(phase, speed)` pro Blatt, phasenversetzt über `LEAF_CONFIGS[i].phase`
- Tau: 2–3 Kreise pro Blatt bei hyd ≥ 50

---

## 3. Aquarium — `fun × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `AquariumState = f(fun, glowTier)`, Fische via Path statt Circle.

| State | fun | glow | Fische | Deko | Bewegung |
|-------|-----|------|--------|------|----------|
| 0 | <15 | beliebig | 0 | Trübes Wasser (graue Schicht), braune Algen am Boden | Keine |
| 1 | 15–40 | beliebig | 1 Fisch (Path) | Klares Wasser, 2 grüne Algen (cubicTo) | Still |
| 2 | 40–60 | <2 | 2 Fische | Algen wachsen, Sandboden (gepunktete Linie) | Langsame Sinus-Bahn |
| 3 | 40–60 | ≥2 | 2 Fische | + Blasen steigen (animiert nach oben) | Mittel |
| 4 | 60–75 | <3 | 3 Fische | Pflanzen blühen, Kieselsteine (Kreise) | Aktiv |
| 5 | 60–75 | ≥3 | 3 Fische | + Lichtreflex auf Wasseroberfläche | Aktiv+ |
| 6 | >75 | <3 | 4 Fische | Korallen, Seepferdchen | Schwimmen |
| 7 | >75 | ≥3 | 5 Fische | Korallen leuchten (Glow), Goldreflex | Schwimmen+ |

**Bausteine:**
- `buildFish()` − Path mit `moveTo + cubicTo` für Fisch-Körper + Schwanzflosse
- `fishMovement` − Sinus-Bahn pro Fisch: phase + speed × tick
- Blasen: `useAnimatedNumeric` für Y-Position, reset bei oben
- Lichtreflex: weißer Path mit opacity 0.15 auf oberer Tank-Hälfte

---

## 4. Shelf — `food × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `ShelfState = f(food, glowTier)`, Deko-Elemente werden hinzugefügt.

| State | food | glow | Napf | Deko |
|-------|------|------|------|------|
| 0 | <15 | beliebig | Leer | Nichts |
| 1 | 15–40 | beliebig | 2 Pellets (Kreise) | Nichts |
| 2 | 40–60 | <2 | 6 Pellets | Kissen einfach (RoundedRect, braun) |
| 3 | 40–60 | ≥2 | 6 Pellets | Kissen + Kerze (Rect + Kreis-Flamme) |
| 4 | 60–80 | <2 | 6 Pellets | Kissen prall (rundere Ecken) + Kerze brennt |
| 5 | 60–80 | ≥2 | 6 Pellets | Kissen gold + Tasse (U-Form-Path) |
| 6 | >80 | <3 | 6 Pellets | Alles + Serviette (weißes Dreieck) |
| 7 | >80 | ≥3 | 6 Pellets | Alles + kleine Topfpflanze |

**Bausteine:**
- Pellets: einfache Kreise, Positionen im Napf-Radius
- Kissen: Path mit `roundRect` oder RoundedRect, Farbe via `comfort`
- Kerzenflamme: cubicTo-Path, animiert via useSway (flackern)
- Tasse: Path mit Henkel (Halbkreis-Path)

---

## 5. Carafe — `bathroom × 4` (invertiert) + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `fill = 100 - clampNeed(bathroom)`, invertiert (niedriger Need = volle Karaffe).

| State | bath | glow | Füllung | Form | Besonderheit |
|-------|------|------|---------|------|-------------|
| 0 | >85 | beliebig | Leer (0–5%) | Karaffe trocken | Tropfen hängt am Ausguss (animiert, `useSway`) |
| 1 | 65–85 | beliebig | 1/4 hellgelb | Boden sichtbar | — |
| 2 | 45–65 | <2 | 1/2 gold | Oberfläche flach (lineTo) | — |
| 3 | 45–65 | ≥2 | 1/2 gold | Oberfläche gewellt (cubicTo) | Glanz auf Glas |
| 4 | 25–45 | <3 | 3/4 amber | Bauch voll | — |
| 5 | 25–45 | ≥3 | 3/4 amber | Bauch voll | Glanz + Tropfen am Hals |
| 6 | <25 | <3 | Voll dunkelgold | Meniskus gewölbt (cubicTo) | — |
| 7 | <25 | ≥3 | Voll+ glänzend | Überlauf-Perle oben | Goldreflex auf Wasser |

**Bausteine:**
- `buildCarafe()` − Path für Karaffen-Kontur (Bauch + Hals + Henkel)
- Wasser-Oberfläche: `cubicTo`-Sinus-Welle
- Tropfen: kleiner Path (Tröpfchen-Form), Y-Animation via useSway

---

## 6. Floor — `hygiene × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `FloorState = f(hygiene, glowTier)`, Flecken via Path statt Circle.

| State | hyg | glow | Flecken | Textur | Extra |
|-------|-----|------|---------|--------|-------|
| 0 | <15 | beliebig | 8 organische Flecken (Path) | Krümel (kleine Kreise) + Kratzer (Line) | Schmutz-Schicht |
| 1 | 15–35 | beliebig | 5 Flecken (Path, opacity 0.6) | Staub-Punkte (opacity 0.3) | — |
| 2 | 35–50 | beliebig | 3 Flecken klein (opacity 0.3) | — | — |
| 3 | 50–70 | <2 | Sauber | Dielen-Struktur (horizontale Linien, opacity 0.1) | — |
| 4 | 50–70 | ≥2 | Sauber | Dielen + leichter Glanz (weißer Halbkreis) | — |
| 5 | 70–85 | beliebig | Sauber | Nass-Glanz (opacity 0.2) | Glanz-Halbkreise |
| 6 | >85 | <3 | Blitzblank | Lichtreflexe (opacity 0.3) | — |
| 7 | >85 | ≥3 | Blitzblank+ | Lichtreflexe | Stern-Sparkles (kleine Path-Sterne) |

**Bausteine:**
- `buildStain()` − organischer Path via 3–4 `cubicTo`-Segmenten
- Dielen-Struktur: horizontale Linien in 10px Abstand
- Sparkles: kleine Path-Sterne aus `moveTo + lineTo + close`

---

## 7. PictureFrame — `averageValue × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `PictureState = f(averageValue, glowTier)`, Szenen via Paths statt Circles.

| State | avg | glow | Motiv | Rahmen |
|-------|-----|------|-------|--------|
| 0 | <15 | beliebig | **Sturm** – graue Rects, Zickzack-Blitze | Weiß |
| 1 | 15–35 | beliebig | **Berg grau** – Dreieck-Path, Regen-Linien | Weiß |
| 2 | 35–55 | <2 | **Berg grün** – Dreieck mit grünem Fill, Sonnen-Circle | Beige |
| 3 | 35–55 | ≥2 | **Berg grün+** – Berg + 2 Wolken-Paths | Beige |
| 4 | 55–75 | <2 | **Wald** – 3 Dreieck-Bäume auf grünem Boden | Beige |
| 5 | 55–75 | ≥2 | **Wald+** – Bäume + Vogel (Path) | Gold |
| 6 | >75 | <3 | **Blumenwiese** – bunte Kreise + Schmetterling (Path) | Gold |
| 7 | >75 | ≥3 | **Regenbogen** – 6 farbige Bögen (cubicTo) | Gold + Glanz |

**Bausteine:**
- Szene 0–7: jeweils 2–5 Skia-Primitives, via useMemo selektiert
- Rahmen: 4 `lineTo`-Paths + `BlurMask` für Schatten
- Regenbogen: 6 `cubicTo`-Bögen mit Farben ROYGBV

---

## 8. WellnessBar — `averageValue × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `WellnessState = f(averageValue, glowTier)`, 3 Segmente (Mind/Body/Soul).

| State | avg | glow | Segmente | Extra |
|-------|-----|------|----------|-------|
| 0 | <20 | beliebig | 1 Segment (rot, Mind) | Riss (Zickzack-Path) |
| 1 | 20–40 | beliebig | 1 Segment (orange, Mind) | — |
| 2 | 40–55 | <2 | 2 Segmente (gelb+grün, Mind+Body) | — |
| 3 | 40–55 | ≥2 | 2 Segmente (gelb+grün) | Leichter Glanz |
| 4 | 55–75 | <2 | 3 Segmente (alle) | — |
| 5 | 55–75 | ≥2 | 3 Segmente (alle) | Glanz pro Segment |
| 6 | >75 | <3 | 3 Segmente voll (alle breit) | Leuchten (opacity glow) |
| 7 | >75 | ≥3 | 3 Segmente voll | Stern-Sparkles + Leuchten |

**Bausteine:**
- 3 Segment-Rects nebeneinander, Breite proportional zu avg
- Riss: Zickzack-Path via `moveTo + lineTo × 3`
- Sparkles: kleine Path-Sterne, random positioniert

---

## 9. Window — `hygiene × 4` + `timeOfDay × 2` = **8 States**

**Status: open**

**Need-Mapping:** `WindowState = f(hygiene, timeOfDay)`, Wetter + Beschlag.

| State | hyg | tod | Scheibe | Wetter |
|-------|-----|-----|---------|--------|
| 0 | <20 | day | Beschlagen + Kondens-Perlen (Kreise opacity 0.3) | Trüb (grauer Rect overlay) |
| 1 | <20 | night | Beschlagen (opacity 0.2) | Dunkel (dunkelblau) |
| 2 | 20–45 | day | Schlieren (vertikale Line-Paths, opacity 0.15) | Hell (palette.windowGlow) |
| 3 | 20–45 | night | Schlieren (opacity 0.1) | Regen außen (fallende Linien) |
| 4 | 45–70 | day | Leicht trüb (opacity 0.05) | Hell + Wolken (Path) |
| 5 | 45–70 | night | Klar | 6 fallende Tropfen (animiert) |
| 6 | >70 | day | Klar | Wolken-Paths (weiche cubicTo) |
| 7 | >70 | night | Klar | Sterne (kleine Paths) + Mondlicht |

**Bausteine:**
- Kondenswasser: Kreise mit opacity 0.2–0.3, random positioniert
- Wolken: cubicTo-Paths (3 Bögen pro Wolke), opacity 0.15
- Fallende Tropfen: lineTo-Path, Y-Animation via `useSway` mit großem Range

---

## 10. Lamp — `comfort × 4` + `timeOfDay × 2` = **8 States**

**Status: open**

**Need-Mapping:** `LampState = f(comfort, timeOfDay)`, Lichtkegel + Flackern.

| State | comfort | tod | Lampe | Lichtkegel |
|-------|---------|-----|-------|-----------|
| 0 | <20 | day | Aus | Keiner |
| 1 | <20 | night | Flackert (opacity oszilliert via useSway) | Schwach, kalt (#8BA0C0), unruhig |
| 2 | 20–45 | day | Aus (Schatten, kleiner Rect) | Keiner |
| 3 | 20–45 | night | An | Klein, kaltweiß (#C0D0E0), fest |
| 4 | 45–70 | day | Aus (leichter Schimmer) | Keiner |
| 5 | 45–70 | night | An | Mittel, warm (#E8D0A0), fest |
| 6 | >70 | day | Dekoglanz (kleiner Kreis) | Keiner |
| 7 | >70 | night | An | Groß, warmweiß (#F0E0B0), leicht flackernd |

**Bausteine:**
- `buildLightCone(width, height, color)` − Path-Dreieck vom Lampenschirm zum Boden, opacity 0.08–0.2
- Flackern: `useSway(phase, 5)` auf Licht-opacity

---

## 11. Bookshelf — `fun × 4` + `glowTier × 2` = **8 States**

**Status: open**

**Need-Mapping:** `BookshelfState = f(fun, glowTier)`, Buch-Höhen + Titel.

| State | fun | glow | Bücher | Extra |
|-------|-----|------|--------|-------|
| 0 | <20 | beliebig | 0 | Leeres Regal |
| 1 | 20–40 | beliebig | 1 Buch (4px hoch) | — |
| 2 | 40–60 | <2 | 2 Bücher (4px + 6px) | — |
| 3 | 40–60 | ≥2 | 3 Bücher (4/6/8px) | Titel-Linien (kleine horizontale Line-Paths) |
| 4 | 60–80 | <2 | 4 Bücher (bunt, versch. Höhen) | — |
| 5 | 60–80 | ≥2 | 5 Bücher + kleine Statue (Path) | Titel-Linien |
| 6 | >80 | <3 | 6 Bücher (volles Regal) | — |
| 7 | >80 | ≥3 | 7 Bücher + Statue + Goldschnitt | Titel-Linien gold |

**Bausteine:**
- Buch: `RoundedRect` mit Höhe 4/6/8px
- Titel-Linien: 2–3 horizontal `Line` pro Buch, opacity 0.4, y-position abhängig von Buch-Höhe
- Statue: kleiner Path (Kopf + Körper)

---

## 12. Particles — `glowTier × 4` + `movement × 2` = **8 States**

**Status: open**

**Need-Mapping:** `ParticleState = f(glowTier, movement)`, Formen + Drift.

| State | glow | move | Count | Form | Bewegung |
|-------|------|------|-------|------|----------|
| 0 | <20 | <50 | 0 | — | — |
| 1 | <20 | ≥50 | 2 | Punkte (Circle) | Langsam schwebend (useSway x+y) |
| 2 | 20–49 | <50 | 4 | Sterne (Path: 5-zack) | Schweben |
| 3 | 20–49 | ≥50 | 6 | Sterne | Mittel |
| 4 | 50–79 | <50 | 8 | Gemischt (Punkte + Sterne) | Schweben |
| 5 | 50–79 | ≥50 | 10 | Gemischt | Schnell |
| 6 | ≥80 | <50 | 12 | Alle Formen (Stern + Blatt + Punkt) | Schweben + Leuchten |
| 7 | ≥80 | ≥50 | 15 | Alle Formen | Schnell + Glitzern (opacity pulsiert) |

**Bausteine:**
- `buildStar()` − Path: 5-zackiger Stern via `moveTo + lineTo × 10`
- Jeder Partikel: `{x, y, form, phaseX, phaseY, speed, opacity}`
- Drift: x += `useSway(phaseX, 0.5)`, y += `useSway(phaseY, 0.3)`

---

## 13. PlantPot — `glowTier × 4` + `hydration × 2` = **8 States**

**Status: open**

**Need-Mapping:** `PlantPotState = f(glowTier, hydration)`, Topf-Design + Erde.

| State | glow | hyd | Topf | Erde | Extra |
|-------|------|-----|------|------|-------|
| 0 | <20 | <50 | Braun (#8B6914) | Trocken (Kreis, #6B4E11) | — |
| 1 | <20 | ≥50 | Braun (#8B6914) | Feucht (Kreis, #5A3E0B) | — |
| 2 | 20–49 | <50 | Terrakotta (#C17F59) | Trocken | — |
| 3 | 20–49 | ≥50 | Terrakotta (#C17F59) | Feucht | Leichter Glanz |
| 4 | 50–79 | <50 | Keramik (#E0C8A0) | Trocken | Muster (gepunktete Linie) |
| 5 | 50–79 | ≥50 | Keramik (#E0C8A0) | Feucht | Muster + Glanz |
| 6 | ≥80 | <50 | Gold (#D4A017) | Trocken | Rand-Linie oben |
| 7 | ≥80 | ≥50 | Gold (#D4A017) | Feucht | Rand + Glanz |

---

## 14. Wall — `environment × 4` + `timeOfDay × 2` = **8 States**

**Status: open**

**Need-Mapping:** `WallState = f(environment, timeOfDay)`, Farbverlauf + Textur.

| State | env | tod | Farbe | Textur |
|-------|-----|-----|-------|--------|
| 0 | <20 | day | Grau (#C0C0C0 → #A0A0A0) | Keine |
| 1 | <20 | night | Dunkelgrau (#808080 → #606060) | Keine |
| 2 | 20–45 | day | Hellbeige (palette.gradientTop → Bottom) | Leichte vertikale Linien (opacity 0.05) |
| 3 | 20–45 | night | Warmbeige (palette, abgedunkelt) | Leichte vertikale Linien |
| 4 | 45–70 | day | Satt (palette voll) | Tapetenmuster (sich wiederholende kleine Paths) |
| 5 | 45–70 | night | Gedämpft warm (palette × 0.7) | Tapetenmuster |
| 6 | >70 | day | Lebendig (palette × 1.1) | Vignette (RadialGradient, rand transparent→schwarz) |
| 7 | >70 | night | Gemütlich (palette warm) | Vignette |

---

## Mapping-Dokument

**Status: open**

`docs/room-need-mapping.md` wird erweitert mit:
- Jede Komponente bekommt eine 8-Zeilen-Tabelle (State 0–7)
- Spalten: State | Need-Wert | Glow-Tier | Sichtbare Elemente | Neu in diesem State
- Pro Komponente eine Referenz zu diesem Plan-Dokument

## Dev Lab State-Anzeige

**Status: open**

Erweiterungen in `app/dev-lab.tsx`:
- Text-Overlay zeigt aktuellen State-Namen + State-Nummer
- Manueller Tier-Override-Slider (für Screenshots/Vergleiche)
- Kopier-Button: aktuellen State als JSON in Zwischenablage

---

## Graphical Level

Jede aufgewertete Komponente erreicht die folgenden grafischen Merkmale, analog zu Pet:

| Merkmal | Vorher (Level 0) | Nachher (Level 1) |
|---------|-----------------|-------------------|
| Körperform | `<Circle>` oder `<RoundedRect>` | `cubicTo`-Ei-Path mit organischer Kontur |
| Schatten | Keiner | `BlurMask` auf Kopie des Körper-Paths |
| Farbe | Flat-Fill | `RadialGradient` (Highlight + Base + Shadow) |
| Glow | Bedingter `<Circle>` | Bedingter Highlight-Path mit eigenem Gradient |
| Per-Frame | `useState` + rAF (JS Thread) | `useReanimatedSway` / `useDerivedValue` (UI Thread) |
| State-Transition | Instant | `useReanimatedNumeric` + `withTiming` (400ms Easing) |
| Sub-Komponenten | Alles in einer Datei | Eine Datei pro visuellem Element im eigenen Ordner |
| Bewegung | `<Group>` mit `transform={{tick}}` | `useDerivedValue`-Transform + SharedValue-Dependency |

Ziel für alle 14 Komponenten in Phase 2: Level 1.

## Animation Toolkit

Alle neuen Komponenten nutzen folgende Hooks statt der alten Muster:

| Hook | Quelle | Ersatz für | Rückgabetyp |
|------|--------|-----------|-------------|
| `useClock` | `@shopify/react-native-skia` | — | `SharedValue<number>` |
| `useDerivedValue(fn)` | `react-native-reanimated` | — | `SharedValue<T>` |
| `useReanimatedSway(phase, speed, amplitude)` | `src/hooks/useReanimatedSway.ts` | Altes `useSway(phase, speed)` | `SharedValue<number>` |
| `useReanimatedNumeric(value, duration)` | `src/hooks/useReanimatedNumeric.ts` | Altes `useAnimatedNumeric` | `SharedValue<number>` |
| `useSharedValue(initial)` | `react-native-reanimated` | `useState` für UI-Werte | `SharedValue<T>` |

**Prinzipien:**
- **UI Thread:** Alle per-Frame (60 fps) Änderungen laufen über SharedValues, nicht über React State.
- **useDerivedValue statt useMemo für Transforms:** `const t = useDerivedValue(() => [{...}])` → `<Group transform={t}>`. Kein Re-Render bei SharedValue-Änderungen.
- **useClock als Zeitbasis:** Ein Aufruf pro Komponente, `useDerivedValue` leitet Sway/Bob/Drift davon ab.
- **withTiming für State-Übergänge:** bodyR, bodyScaleY, earAngle werden sanft interpoliert (400ms default).
- **useState nur < 1 Hz:** Blink-Boolean, glowHighlight, showPaws – alles, was nur auf State-Wechsel feuert.
- **Kein globaler rAF mehr:** `useSway.ts` wurde auf per-Hook rAF + Date.now() umgestellt. Neue Komponenten nutzen `useReanimatedSway` (kein rAF, rein UI Thread).

## Architektur-Regeln (für alle Komponenten)

1. **`.copy()` vor `.transform()`** – Jeder Pfad der skaliert/transformiert wird
2. **`useReanimatedSway` statt `useSway` für neue Komponenten** – Alte Plant-Komponenten bleiben auf `useSway`, alle Neuen nutzen SharedValue-basiert
3. **`useReanimatedNumeric` statt `useAnimatedNumeric`** – Alte Nutzung wird schrittweise migriert
4. **SharedValue für animate, boolean für conditional** – Transform und Kontur via `useDerivedValue`; Sichtbarkeit (`showPaws`, `glowHighlight`) via React-Boolean
5. **Paths statt Shapes** – Ein `cubicTo`-Path ist günstiger und flexibler als 6 `<Circle>`
6. **Kein `#RRGGBBAA` in Skia-Komponenten** – rgba() für Opacity
7. **Kein leerer Path** – immer `moveTo` + `close`
8. **Neue Elemente hinzufügen, nicht nur skalieren** – Jeder State 1–7 fügt mindestens ein neues sichtbares Skia-Element hinzu
9. **Jeder State muss im Dev Lab sichtbar sein**

---

## Progress-Tracker

| # | Komponente | Status | Datum |
|---|-----------|--------|-------|
| 1 | Pet (Sub-Component Refactor) | done | 2026-06-07 |
| 2 | HangingPlant | done | 2026-06-07 |
| 3 | Aquarium | done | 2026-06-07 |
| 4 | Shelf | open | — |
| 5 | Carafe | open | — |
| 6 | Floor | open | — |
| 7 | PictureFrame | open | — |
| 8 | WellnessBar | open | — |
| 9 | Window | open | — |
| 10 | Lamp | open | — |
| 11 | Bookshelf | open | — |
| 12 | Particles | open | — |
| 13 | PlantPot | open | — |
| 14 | Wall | open | — |
| — | Mapping-Doku | open | — |
| — | Dev Lab States | open | — |
| — | Animation Toolkit (`useReanimated*` hooks) | done | 2026-06-07 |
| — | PetShapes (`petShapes.ts`) | done | 2026-06-07 |
| — | Architecture Rules 2.0 | done | 2026-06-07 |
