# Slice 5 — Notifications

## Goal

Add timeliness without complexity.

## Features

- Notification center
- Realtime badge updates
- Background fanout jobs

## Data Models

- Notification
- NotificationDelivery
- PresenceSession

## Notes

- Use queues for fanout
- Avoid heavy realtime dependency

## Definition of Done

- Notifications are reliable
- Unread counts update in near realtime