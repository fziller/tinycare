# Android Notification QA

Use this checklist for Android internal builds. Expo Go is not enough because native notification behavior and MMKV need a real native runtime.

## Scenarios

- Permission prompt appears only after tapping the reminder CTA.
- Notification channel is named `Need reminders`.
- A low need schedules a reminder with actions: `Erledigt`, `Snooze 30m`, `Heute pausieren`, `Öffnen`.
- `Erledigt` logs the smallest action for that need after the app foregrounds.
- `Snooze 30m` delays the reminder and does not fill the need.
- `Heute pausieren` pauses the need until end of day.
- Tapping the notification body opens the app without logging an action.
- Background app and killed app states both process the response after app launch.
- Battery saver mode does not create duplicate reminders.

## Known MVP Constraint

Expo notification actions are registered with `opensAppToForeground: true` for reliability. A future Notifee pass can explore richer background execution if the product needs it.
