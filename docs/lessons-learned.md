# Lessons Learned — Plant Rendering (Skia)

## 1. Niemals `Skia.Path.Make()` als Fallback verwenden

### Problem
`_empty = Skia.Path.Make()` erzeugt einen Pfad ohne Verbs/Points.
`computeTightBounds()` auf einem leeren Pfad gibt auf iOS `CGRectNull` → Skia mapped zu `NaN`.
`NaN` in `RadialGradient`-Parametern (`vec(NaN, NaN)`, `r = NaN`) → Native Skia Crash → gesamter Canvas bricht zusammen.

### Fix
Fallback-Pfad muss **garantierte positive Bounds** haben. Ein 1×1-Pixel-Rechteck erfüllt dies:

```ts
const fallback = Skia.Path.Make();
fallback.moveTo(0, 0);
fallback.lineTo(1, 0);
fallback.lineTo(1, 1);
fallback.lineTo(0, 1);
fallback.close();
```

### Regel
Jeder Skia-Pfad, der in `computeTightBounds()` oder `RadialGradient` landet, muss
garantierte, nicht-NaN Bounds haben. **`Skia.Path.Make()` ohne Befüllung ist tabu.**

---

## 2. `#RRGGBBAA` wird von Skia nicht unterstützt

### Problem
`'#E8795BCC'` (Hex-Alpha) ist kein gültiges CSS- oder Skia-Farbformat.
React Native `StyleSheet` akzeptiert es, React Native Skia (`Path`, `RadialGradient`) nicht.
→ Native Crash.

### Fix
Nur folgende Formate in Skia verwenden:
- `'#RRGGBB'` (6-stelliges Hex)
- `'rgba(r,g,b,a)'` (CSS rgba)
- Named colors (`'black'`, `'white'`)

### Regel
**Farbstrings in Skia-Komponenten** müssen entweder 6-stelliges Hex oder CSS `rgba()` sein.
8-stelliges Hex (`#RRGGBBAA`) ist nur für `StyleSheet` (React Native, nicht Skia) geeignet.

---

## 3. Skia Path-Objekte nicht im useMemo rekreieren, wenn nur Position/Opacity sich ändern

### Problem
`getLeafPaths()` erzeugt via `scalePath()` neue `SkPath`-Objekte (neue GPU-Ressourcen).
Wenn dies in einem `useMemo` passiert, das von einem animierten Wert (`hyd`, `growth`) abhängt,
werden 60×/Sekunde neue Paths auf die GPU geladen. Die GPU kann nicht stabil rendern →
Flicker, verschwundene Leaves.

### Fix
Aufteilung in **Geometry** (Paths, stabil) und **Position** (animiert, billig):

```ts
// Nur bei Tier-Wechsel (kein Animations-Dep)
const leafGeometry = useMemo(() => {
  // Paths und Gradient-Parameter
}, [activeConfig]);

// Pro Frame bei Hyd-Änderung, aber ohne Skia-Objekte
const leafPositions = useMemo(() => {
  // Nur Zahlen (x, y, angle)
}, [activeConfig, stemTop, stemHeight, hyd]);
```

Size-Veränderung (Growth-Animation) wird als **Skia-Transform** `[{ scale }]` auf das
Path-Group gelegt, nicht via Pre-Scaling:

```tsx
<Group transform={[{ scale: sizeMul }, { rotate }]}>
  <Path path={path /* unscaled */}>
    <RadialGradient ... />
  </Path>
</Group>
```

Gradient skaliert automatisch mit, da im gleichen Group.

### Regel
**Skia-Paths sind GPU-Ressourcen.** Sie dürfen nicht auf jedem Animationsframe neu erstellt werden.
Trenne Geometry (Paths, Gradienten) strikt von Position/Opacity/Darstellung.
Animierte Größenänderungen via `[{ scale }]`-Transform, nicht via `scalePath`.

---

## 4. `useMemo`-Dependencies müssen die tatsächliche Re-Compute-Ursache abbilden

### Problem
`activeConfig = TIER_MAP[tier]` gibt eine **stabile Referenz** für denselben Tier.
`useMemo` mit `[activeConfig]` cached korrekt über Re-Render hinweg — das ist gewollt.
Aber `activeConfig.count` kann NICHT als Dependency verwendet werden, wenn `activeConfig`
selbst schon im Dep-Array ist (es referenziert dasselbe Objekt).

### Regel
Verwende **Objekt-Referenzen für stabile Konfigurationen** (wie `TIER_MAP`), nicht
rekonstruierte Objekte. Das `useMemo` cached dann korrekt.

---

## 5. Gleiche Anzahl an Leaves in Geometry und Positions-Array

### Problem
`leafGeometry` und `leafPositions` müssen dieselbe Länge haben. Wenn ein Leaf-Generator
(`continue` bei leeren Paths) die Geometry kürzt, die Positions aber nicht, sind Indizes
verschoben und falsche Leaves an falschen Positionen.

### Fix
Beide Arrays mit derselben Logik befüllen, oder die selbe Prüfung in beiden verwenden.
Am besten: **keine runtime-Filterung** (Paths sind immer valide durch Punkt 1).

### Regel
**Geometry- und Positions-Arrays müssen immer gleich lang sein.**
Filtere Leaves nicht in einem Array und lass sie im anderen ungefiltert.

---

## 6. `path.transform(m)` MUTIERT den SkPathBuilder (Singleton-Problem)

### Problem
`JsiSkPath::transform()` (C++ native JSI-Binding, Zeile 387-394 in `JsiSkPath.h`)
ruft `getObject()->transform(m3)` auf dem internen `SkPathBuilder` auf und gibt
`this` zurück — es wird **in place mutiert, keine Kopie erstellt**.

```cpp
JSI_HOST_FUNCTION(transform) {
    auto m3 = *JsiSkMatrix::fromValue(runtime, arguments[0]);
    getObject()->transform(m3);             // <-- mutiert den PathBuilder
    return thisValue.getObject(runtime);    // <-- gibt das SELBE Objekt zurück
}
```

Wenn `scalePath()` auf Modul-Level-Singletons (`BABY_LEAF`, `SMALL_MONSTERA`,
`FULL_MONSTERA`) aufgerufen wird, compoundiert jeder Aufruf die Transformation in
den Singleton hinein:

```
Beispiel FULL_MONSTERA bei tier 3:
  1. scale(1.0) → 1.0×
  2. scale(1.1) → 1.1× (compoundiert auf 1.0)
  3. scale(1.0) → 1.1×
  4. scale(0.85) → 0.935×
  5. scale(0.75) → 0.701×
```

Nach jedem tier-Wechsel wird der Singleton weiter komprimiert → nach wenigen
Runden verschwinden die Blätter oder werden zu Pixel-Dots.

Zusätzlich teilen sich alle Leaves im `Array.from`-Loop **dasselbe** bereits
mutierte Path-Objekt (keine unabhängigen Kopien), weil `transform()` keinen
neuen Path erzeugt.

### Fix
Vor `transform()` zwingend `.copy()` aufrufen, um einen unabhängigen
`SkPathBuilder` zu erhalten:

```ts
const scalePath = (path: SkPath, s: number) => {
  const m = Skia.Matrix();
  m.scale(s, s);
  const c = path.copy();   // <-- zwingend: unabhängige Kopie
  c.transform(m);
  return c;
};
```

`path.copy()` (C++ Zeile 597-602) snapshottet den aktuellen PathBuilder und
erstellt einen neuen JsiSkPath mit frischem SkPathBuilder aus dem Snapshot.
Kein Shared State.

### Regel
**Jeder `path.transform()`-Aufruf muss auf einer `.copy()` erfolgen, wenn der
Path wiederverwendet wird (Singleton).** Gleiches gilt für alle anderen
mutierenden Path-Methoden (`offset()`, `addPath()`, etc.).

`SkPath`-Methoden in React Native Skia sind mehrheitlich **mutierend** (sie
geben `this` zurück). Im Zweifel die native C++ JSI-Bindung prüfen oder
`.copy()` vor jeder Mutation aufrufen.

---

## 7. Animationsgeschwindigkeit: Counter-basiert vs. zeitbasiert

### Problem
`useSway` verwendete `Math.sin(tick * 0.003 * speed + phase) * 0.12` mit
`tick` als Frame-Counter (+1 pro requestAnimationFrame bei 60 fps).

Das ergibt:
- `0.003` rad/Frame × 60 fps = `0.18` rad/s
- Eine volle Sinus-Periode dauert `2π / 0.18 ≈ 35` Sekunden
- Peak-Geschwindigkeit: `0.003 × 0.12 = 0.00036` rad/Frame = `0.02`°/Frame
- Bei 30px Blattlänge: `0.01` Pixel Tip-Bewegung pro Frame

→ **Unsichtbar**, obwohl rAF-Loop und useState-Re-Rendering korrekt laufen.

### Fix
Zeitbasierte Animation mit `requestAnimationFrame` + `useState`:

```ts
export function useSway(phase: number, speed: number): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let rafId: number;
    function loop() {
      setElapsed(Date.now() - start);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const freq = 0.003;       // rad/ms → 2π/0.003 ≈ 2s pro Periode
  return Math.sin(elapsed * freq * speed + phase) * 0.12;
}
```

- `elapsed` in Millisekunden → `elapsed * 0.003` = `3` rad/s → **~2s pro Periode**
- Frame-Drops: kein Problem, da `Date.now()` die echte Zeit liefert
- `±0.12` rad Amplitude ≈ `±7°` → bei 30px Blatt: `±3.6` Pixel Tip-Bewegung

### Faustregel für Animationskonstanten
```
Geschwindigkeit in rad/s:       freq × 1000 (weil elapsed in ms)
Periodendauer in Sekunden:      2π / (freq × 1000)
Bewegung pro Frame bei 60fps:   freq × amplitude × 16.67 [rad]
Tip-Bewegung pro Frame [px]:    freq × amplitude × 16.67 × leafLength
```

Für sichtbare Animationen: Periodendauer ≤ 3s, Tip-Bewegung ≥ 1px/Frame am
steilsten Punkt der Kurve.

### Regel
**Counter-basierte Animation (`tick * const`) ist Frame-Rate-abhängig und
produziert bei 60fps oft überraschend langsame Bewegungen.** Verwende
zeitbasierte Werte (ms seit Start) für vorhersagbare, Frame-Rate-unabhängige
Animationen. Faustregel: `freq = 0.003` (= 3 rad/s) für eine ~2s Periode.
