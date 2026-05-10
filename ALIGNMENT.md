# Frontend Design ↔ Backend API Alignment Report

## Register Page

| Design field | API field | Status |
|---|---|---|
| First / Last name | `firstName`, `lastName` | ✅ |
| Email | `email` | ✅ |
| Phone | `phoneNo` | ✅ |
| City | `city` | ✅ |
| Country | `country` | ✅ |
| About you | `bio` | ❌ `POST /auth/register` doesn't accept `bio` — needs `PUT /users/me` after registration |
| _(no field)_ | `password` | ❌ Register form has no password input |

---

## Create Trip Page

| Design field | API field | Status |
|---|---|---|
| Trip name | `title` | ✅ |
| Start / End date | `startDate`, `endDate` | ✅ |
| Destination | `destination` | ✅ |
| Description | `description` | ✅ |
| Companions | _(nothing)_ | ❌ No backend model — Trip has no collaborators concept |
| _(no field)_ | `budgetLimit` | ❌ Budget limit not collectible at creation |

---

## Build Itinerary Page — Biggest Mismatch

| Design concept | API reality | Status |
|---|---|---|
| Free-text section title (e.g. "Rome — three slow days") | `TripStop.cityId` — must be an integer ID from seeded City catalog | ❌ No free-text city name |
| Section tags (Walking, Food, Architecture) | `TripStop` has no tags field | ❌ |
| Per-section flat budget amount | `TripStop` has no budget field — budget derives from activities + accommodation | ❌ |
| No city picker UI | `cityId` required on stop creation | ❌ UI must have city search/select tied to `GET /cities` |

---

## Itinerary View — Budget Sidebar

| Design category | API breakdown field | Status |
|---|---|---|
| Travel | `transport` | ✅ |
| Stay | `accommodation` | ✅ |
| Activities | `activities` | ✅ |
| Food | `expenses` (MEAL) | ✅ |
| Misc | `expenses` (MISC / OTHER) | ✅ |

Budget sidebar maps cleanly to `GET /trips/:id/budget`.

---

## Itinerary View — Activity Types

Design shows: `Travel`, `Stay`, `Food`, `Walk`, `Tour`

`ActivityType` enum: `SIGHTSEEING`, `FOOD`, `ADVENTURE`, `CULTURE`, `SHOPPING`, `WELLNESS`, `NIGHTLIFE`, `NATURE`, `OTHER`

| Design type | Maps to | Status |
|---|---|---|
| Food | FOOD | ✅ |
| Walk | SIGHTSEEING / NATURE | ⚠️ No exact match |
| Tour | CULTURE / OTHER | ⚠️ No exact match |
| Travel | `TripTransport` (separate model, not an activity) | ❌ |
| Stay | `TripAccommodation` (separate model, not an activity) | ❌ |

---

## Notes Page

| Design | API | Status |
|---|---|---|
| Title, body, date | `title`, `content`, `noteDate` | ✅ |
| Tags (Stay, Logistics, Food…) | No `tags` field on `TripNote` | ❌ |
| "By stop" tab | `TripNote` has no `tripStopId` | ❌ Cannot group notes by stop |

---

## Packing Page

| Design category | `PackingCategory` enum | Status |
|---|---|---|
| Documents | DOCUMENTS | ✅ |
| Clothing | CLOTHING | ✅ |
| Electronics | ELECTRONICS | ✅ |
| Wellness | _(no WELLNESS)_ — enum has MEDICATIONS, TOILETRIES, OTHER | ❌ |

---

## Profile Page

| Design field | API field | Status |
|---|---|---|
| Email, Phone, City | `email`, `phoneNo`, `city` | ✅ |
| Location (City + Country) | `city` + `country` | ✅ |
| Languages (plural, "EN · PT · IT") | `language` (single string) | ❌ Design implies multi-language, API is single value |
| Currency | _(no field)_ | ❌ Not in User model |
| Visibility | _(no field)_ | ❌ Not in User model |
| Saved destinations | `GET /users/me/saved-destinations` → City objects | ✅ |

---

## Search Page

| Design | API | Status |
|---|---|---|
| Global activity search | Only `GET /cities/:id/activities` (per city) — no global search endpoint | ❌ |
| International activities (Greece, Turkey, France…) | Seeds are India-only cities | ❌ |

---

## Admin Page

| Design stat | API response | Status |
|---|---|---|
| Active members | `totalUsers` (total, not active) | ⚠️ |
| Trips created | `totalTrips` | ✅ |
| Avg trip budget | Not in `GET /admin/stats` | ❌ |
| Community posts | No posts model exists | ❌ |
| "Last 12 weeks" chart | Only total counts, no time-series endpoint | ❌ |
| User "Status" (Active / Idle) | No status / last-active field on User | ❌ |
| User "Last activity" | No such field | ❌ |

---

## Community Page

The entire Community concept (posts, read counts, tags, "Copy itinerary") has **no backend model**. Backend only exposes `Trip.isPublic` + `publicSlug` for sharing via `GET /trips/public/:slug`. This page needs either a new `Post` model or a redesign to list public trips.

---

## Invoice Page

VAT, Discount, Grand total, payment status, and invoice number have **no data source in the backend**. This is a frontend-generated view built on top of `GET /trips/:id/budget`. VAT / discount / booking status would need new fields or a separate model.

---

## Priority Summary

| Priority | Issue |
|---|---|
| P0 | Register form missing password field |
| P0 | Build Itinerary needs city picker (integer `cityId`, not free text) — full UX paradigm change |
| P0 | No global activity search endpoint — Search page cannot function |
| P1 | Register `bio` must be saved via `PUT /users/me` after registration |
| P1 | Note tags and "By stop" tab need schema additions (`tags[]`, `tripStopId` on `TripNote`) |
| P1 | Packing `Wellness` category — rename to match enum (`MEDICATIONS`) or add `WELLNESS` to enum |
| P1 | Community page needs a `Post` model or redesign to surface public trips |
| P2 | Profile: `currency`, `visibility`, multi-language — not in User model |
| P2 | Admin: time-series data, avg budget stat, last-active tracking, community posts count |
| P2 | Create Trip: `budgetLimit` field missing from form; Companions has no backend equivalent |
