# Slice 1 — Core Media Player

## Goal

Deliver a usable single-user product.

## Features

- Search bar
- Media results
- Bottom player
- Playback queue
- History
- Save/favorite

## Data Models

- MediaItem
- UserSavedMedia
- PlayHistory
- PlaybackQueueSnapshot

## Notes

- Treat YouTube as external source
- Store normalized metadata only

## Definition of Done

- User can search and play media
- Player persists across navigation
- History works