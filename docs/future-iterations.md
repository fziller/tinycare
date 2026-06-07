# TinyCare Future Iterations

This document is the follow-up backlog for work after the local MVP proves that need bars are useful without increasing shame or pressure.

## Need Catalog Expansion

- Add Mind / Mood, Medication, Sunlight, Sleep Prep, Recovery, Focus Break, Food Prep, Chores, and Outside Time.
- Keep default onboarding small. New bars should be templates, not forced defaults.
- Treat sensitive bars like Medication, Mood, and Social as opt-in only.

## Modes

- Hyperfocus Mode: manual session start, 2-4 hour check-in, direct notification actions for water, snack, bathroom, and movement.
- Recovery Mode: slower decay, fewer reminders, stronger energy/rest language, no ambitious prompts.
- Mode tuning: validate whether Survival should cap reminders at 1-3 per day.

## Notifications

- Add richer action categories per need, not one generic category.
- Consider Notifee if Expo notification actions become too limiting for true background behavior.
- Add Android-first QA for killed-state, battery saver, notification channels, and action foregrounding.
- Add iOS TestFlight QA for categories, permissions, and action labels.

## Customization

- Custom Needs with editable label, decay, threshold, tone copy, and quick actions.
- Custom tiny action per need so `Erledigt` maps to the user's own minimum-care step.
- Templates for common setups: Student, Remote Work, Burnout Recovery, Night Owl, Survival Week.

## Room / Garden Progress

- Expand the Skia scene into selectable room/garden themes.
- Add cosmetic unlocks driven by Glow, not performance XP.
- Add animation states for low/stable needs without making the room look punished or neglected.
- Use generated concept art only as direction; production assets should be licensed or deterministic.

## Widgets

- Android home screen widget first: show 3 selected needs and one tiny action.
- iOS widget after Android stabilizes.
- Premium boundary can include widget styles, but basic reminder functionality should stay free.

## Monetization

- Keep Basic Needs, Survival Mode, and safety/disclaimer features free.
- Test Premium for themes, unlimited custom needs, widgets, private backups, and advanced stats.
- Avoid streak rescue, loot boxes, shame-based upsells, or crisis-adjacent monetization.

## Backup / Sync

- Start with local export/import before cloud sync.
- Add optional account only after privacy positioning and data retention policy are clear.
- Sync should never be required for core use.

## Analytics Validation

- Track only minimal, non-content events if analytics is enabled.
- Candidate metrics: D1/D7 retention, quick actions per day, notification action rate, snooze rate, pause rate, Survival usage.
- Qualitative check remains mandatory: do low bars feel helpful, neutral, or shamey?

## Health / Wearables

- Google Fit / Apple Health are future-only.
- Do not infer medical state from health data.
- Any medication or mood feature needs extra ethical review before release.

## Positioning

- Use "self-care HUD" and "neurodivergence-friendly" carefully.
- Avoid ADHS/depression treatment claims unless clinically validated.
- Add localized crisis resources only when market/language is chosen.
