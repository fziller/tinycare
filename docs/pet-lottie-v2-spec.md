# Pet Lottie Spec

Diese Datei ist die Handoff-Spec fuer Creator-Exports.
Die Platzhalter-JSONs in `assets/lottie/pet/` duerfen spaeter 1:1 mit finalen Creator-Exports ueberschrieben werden.

## Motion Direction

- Personality: playful
- Stimmung: warm, neugierig, sicher
- Keine shamey oder hektische Motion
- Gleiche Artboard-Groesse fuer alle Clips: `160x160`
- Transparenter Hintergrund
- Ground anchor fuer alle Clips identisch halten

## Loop Clips

- `pet-loop-hide`
  Pose: klein, eingezogen, verletzlich
  Emotion: ueberfordert aber nicht bedrohlich
  Motion: feines Tremble, X-eyes
- `pet-loop-sit-small`
  Pose: klein sitzend
  Emotion: ruhig, etwas reserviert
  Motion: sanftes breathing
- `pet-loop-sit-wag`
  Pose: sitzend
  Emotion: offen, ansprechbar
  Motion: tail wag
- `pet-loop-idle`
  Pose: neutral
  Emotion: stabil
  Motion: breathing, tail sway
- `pet-loop-idle-glow`
  Pose: neutral
  Emotion: cozy
  Motion: idle + soft glow pulse
- `pet-loop-idle-blink`
  Pose: neutral
  Emotion: content
  Motion: idle + occasional blink
- `pet-loop-hop`
  Pose: stretched upright
  Emotion: alert, energetic
  Motion: hop bounce
- `pet-loop-play`
  Pose: expressive and proud
  Emotion: joyful
  Motion: fast wag, heart, nose glow

## Transition Clips

- `pet-transition-hide-to-idle`
- `pet-transition-idle-to-hide`
- `pet-transition-idle-to-hop`
- `pet-transition-hop-to-idle`
- `pet-transition-idle-to-play`
- `pet-transition-play-to-idle`

## Export Rules

- Export as plain Lottie JSON
- Keep filenames exact
- Overwrite placeholder files in `assets/lottie/pet/`
- Verify same bounding box and ground anchor before replacing all clips
