import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const roomSceneSource = readFileSync(join(fileURLToPath(new URL('.', import.meta.url)), 'RoomScene.tsx'), 'utf8');

describe('RoomScene layering', () => {
  it('renders the aquarium exactly once as an overlay view', () => {
    expect(roomSceneSource.match(/<Aquarium\b/g)?.length ?? 0).toBe(1);
    expect(roomSceneSource).toContain('styles.aquariumOverlay');
  });

  it('keeps the aquarium overlay after the pet overlay and before particles', () => {
    const petIndex = roomSceneSource.indexOf('<Pet targetState={petTargetState} />');
    const aquariumIndex = roomSceneSource.indexOf('<Aquarium');
    const particlesIndex = roomSceneSource.indexOf('<Particles');

    expect(petIndex).toBeGreaterThan(-1);
    expect(aquariumIndex).toBeGreaterThan(petIndex);
    expect(particlesIndex).toBeGreaterThan(aquariumIndex);
  });
});
