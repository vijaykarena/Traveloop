# Traveloop API Documentation

Base URL: `http://localhost:4000`

All protected routes require a `Bearer` token in the `Authorization` header:
```
Authorization: Bearer <token>
```

Tokens are returned on login and register. They expire in **7 days**.

---

## Table of Contents

- [Auth](#auth)
- [Users](#users)
- [Cities](#cities)
- [Trips](#trips)
  - [Trip CRUD](#trip-crud)
  - [Budget Summary](#budget-summary)
  - [Stops](#stops)
  - [Stop Activities](#stop-activities)
  - [Accommodation](#accommodation)
  - [Transport](#transport)
  - [Expenses](#expenses)
  - [Packing](#packing)
  - [Notes](#notes)
- [Admin](#admin)
- [Enums](#enums)
- [Error Responses](#error-responses)

---

## Auth

### POST `/auth/register`

Create a new user account.

**Auth:** None

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "Raj",
  "lastName": "Sharma",
  "city": "Mumbai",
  "country": "India",
  "countryCode": "IN",
  "phoneNo": "+919876543210"
}
```

> `country` and `countryCode` are optional. All other fields are required.

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Raj",
    "lastName": "Sharma",
    "city": "Mumbai",
    "country": "India",
    "countryCode": "IN",
    "phoneNo": "+919876543210",
    "role": "USER",
    "avatarUrl": null,
    "bio": null,
    "language": "en",
    "createdAt": "2026-05-10T07:00:00.000Z",
    "updatedAt": "2026-05-10T07:00:00.000Z"
  },
  "token": "<jwt>"
}
```

---

### POST `/auth/login`

Authenticate an existing user.

**Auth:** None

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "user": { ...user object },
  "token": "<jwt>"
}
```

---

### POST `/auth/forgot-password`

Send a password reset link to the user's email.

**Auth:** None

**Body:**
```json
{ "email": "user@example.com" }
```

**Response `200`:**
```json
{
  "message": "If an account with that email exists, we have sent a reset link."
}
```

> Always returns the same message regardless of whether the email exists (security).

---

### POST `/auth/reset-password`

Reset password using the token from the email link.

**Auth:** None

**Body:**
```json
{
  "token": "<reset-token>",
  "newPassword": "newSecret123"
}
```

**Response `200`:**
```json
{ "message": "Password reset successful" }
```

---

## Users

All `/users` routes require authentication.

### GET `/users/me`

Get the current user's profile.

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Raj",
  "lastName": "Sharma",
  "city": "Mumbai",
  "country": "India",
  "countryCode": "IN",
  "phoneNo": "+919876543210",
  "role": "USER",
  "avatarUrl": null,
  "bio": null,
  "language": "en",
  "createdAt": "2026-05-10T07:00:00.000Z",
  "updatedAt": "2026-05-10T07:00:00.000Z"
}
```

---

### PUT `/users/me`

Update the current user's profile. All fields are optional.

**Body:**
```json
{
  "firstName": "Rajesh",
  "lastName": "Sharma",
  "city": "Delhi",
  "country": "India",
  "countryCode": "IN",
  "phoneNo": "+919876543211",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Avid traveler.",
  "language": "hi"
}
```

**Response `200`:** Updated user object (no password).

---

### DELETE `/users/me`

Permanently delete the current user's account and all associated data.

**Response `204`:** No content.

---

### GET `/users/me/saved-destinations`

List all cities the user has bookmarked.

**Response `200`:**
```json
[
  {
    "id": 3,
    "name": "Goa",
    "costIndex": 1.2,
    "popularity": 95,
    "description": "Beach paradise.",
    "imageUrl": "https://example.com/goa.jpg",
    "latitude": 15.2993,
    "longitude": 74.124,
    "activities": [
      { "id": 12, "name": "Baga Beach", "type": "NATURE" }
    ]
  }
]
```

---

### POST `/users/me/saved-destinations`

Save a city as a destination.

**Body:**
```json
{ "cityId": 3 }
```

**Response `201`:**
```json
{ "message": "Destination saved" }
```

> Idempotent — saving an already-saved city does not error.

---

### DELETE `/users/me/saved-destinations/:cityId`

Remove a saved destination.

**Response `204`:** No content.

---

## Cities

All `/cities` routes require authentication.

### GET `/cities`

Search and list cities.

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Name search (case-insensitive) |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Results per page (max 100) |
| `sortBy` | `popularity` \| `costIndex` | `popularity` | Sort order |

**Response `200`:**
```json
{
  "cities": [
    {
      "id": 1,
      "name": "Mumbai",
      "costIndex": 1.5,
      "popularity": 100,
      "description": "City of dreams.",
      "imageUrl": "https://example.com/mumbai.jpg",
      "latitude": 19.076,
      "longitude": 72.8777,
      "_count": { "activities": 12, "tripStops": 45 }
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 20
}
```

---

### GET `/cities/:id`

Get a single city with all its activities.

**Response `200`:**
```json
{
  "id": 1,
  "name": "Mumbai",
  "costIndex": 1.5,
  "popularity": 100,
  "description": "City of dreams.",
  "imageUrl": "https://example.com/mumbai.jpg",
  "latitude": 19.076,
  "longitude": 72.8777,
  "activities": [
    {
      "id": 1,
      "name": "Gateway of India",
      "description": "Iconic arch monument.",
      "type": "SIGHTSEEING",
      "estimatedCost": 0,
      "durationHours": 1.5,
      "imageUrl": null,
      "cityId": 1
    }
  ],
  "_count": { "tripStops": 45 }
}
```

---

### GET `/cities/:id/activities`

List activities for a city with optional filters.

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | [`ActivityType`](#enums) | Filter by activity type |
| `maxCost` | number | Max estimated cost |
| `maxDuration` | number | Max duration in hours |

**Response `200`:** Array of activity objects, sorted by `estimatedCost` ascending.

---

## Trips

All `/trips` routes require authentication **except** `GET /trips/public/:slug`.

---

## Trip CRUD

### GET `/trips`

List all trips belonging to the current user.

**Response `200`:**
```json
[
  {
    "id": 1,
    "title": "Golden Triangle",
    "destination": "Delhi - Agra - Jaipur",
    "description": "Classic India tour.",
    "coverPhotoUrl": null,
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-11-10T00:00:00.000Z",
    "isPublic": false,
    "publicSlug": null,
    "budgetLimit": 50000,
    "createdAt": "2026-05-10T07:00:00.000Z",
    "_count": { "stops": 3 }
  }
]
```

---

### POST `/trips`

Create a new trip.

**Body:**
```json
{
  "title": "Golden Triangle",
  "destination": "Delhi - Agra - Jaipur",
  "description": "Classic India tour.",
  "coverPhotoUrl": "https://example.com/cover.jpg",
  "startDate": "2026-11-01",
  "endDate": "2026-11-10",
  "budgetLimit": 50000
}
```

> `title`, `startDate`, `endDate` are required. All others are optional.

**Response `201`:** Full trip object.

---

### GET `/trips/public/:slug`

Get a public trip by its share slug. **No authentication required.**

**Response `200`:**
```json
{
  "id": 1,
  "title": "Golden Triangle",
  "isPublic": true,
  "publicSlug": "golden-triangle-x7k2m9",
  "user": {
    "firstName": "Raj",
    "lastName": "Sharma",
    "avatarUrl": null
  },
  "stops": [ ...stops with city, activities, accommodation ],
  "transports": [ ...transport legs ]
}
```

**Response `404`:** Trip not found or not public.

---

### GET `/trips/:id`

Get a single trip with full details. Must be the trip owner.

**Response `200`:**
```json
{
  "id": 1,
  "title": "Golden Triangle",
  "destination": "Delhi - Agra - Jaipur",
  "startDate": "2026-11-01T00:00:00.000Z",
  "endDate": "2026-11-10T00:00:00.000Z",
  "isPublic": false,
  "publicSlug": null,
  "budgetLimit": 50000,
  "stops": [
    {
      "id": 1,
      "order": 1,
      "arrivalDate": "2026-11-01T00:00:00.000Z",
      "departureDate": "2026-11-03T00:00:00.000Z",
      "notes": null,
      "city": { "id": 2, "name": "Delhi", ... },
      "activities": [
        {
          "id": 1,
          "scheduledDate": null,
          "actualCost": null,
          "notes": null,
          "activity": { "id": 5, "name": "Red Fort", "type": "SIGHTSEEING", ... }
        }
      ],
      "accommodation": {
        "id": 1,
        "name": "Hotel Raj",
        "checkIn": "2026-11-01T14:00:00.000Z",
        "checkOut": "2026-11-03T11:00:00.000Z",
        "costPerNight": 3500
      }
    }
  ],
  "transports": [ ... ],
  "expenses": [ ... ],
  "notes": [ ... ],
  "packing": [ ... ]
}
```

---

### PUT `/trips/:id`

Update trip metadata. All fields optional.

**Body:**
```json
{
  "title": "Updated Title",
  "destination": "New Route",
  "description": "Updated description.",
  "coverPhotoUrl": "https://example.com/new-cover.jpg",
  "startDate": "2026-11-02",
  "endDate": "2026-11-11",
  "budgetLimit": 60000,
  "isPublic": true
}
```

> Setting `isPublic: true` auto-generates a `publicSlug` if one doesn't exist.
> Setting `isPublic: false` clears the `publicSlug`.

**Response `200`:** Updated trip object.

---

### DELETE `/trips/:id`

Delete a trip and all its associated data (stops, activities, accommodation, transport, expenses, packing, notes).

**Response `204`:** No content.

---

## Budget Summary

### GET `/trips/:id/budget`

Compute the full cost breakdown for a trip.

**Response `200`:**
```json
{
  "budgetLimit": 50000,
  "total": 38500,
  "overBudget": false,
  "avgCostPerDay": 3850,
  "breakdown": {
    "accommodation": 21000,
    "activities": 5500,
    "transport": 8000,
    "expenses": 4000
  }
}
```

> `accommodation` cost = `costPerNight × nights` for each stop.
> `activities` cost = `actualCost` if set, otherwise `activity.estimatedCost`.

---

## Stops

### POST `/trips/:id/stops`

Add a city stop to a trip.

**Body:**
```json
{
  "cityId": 2,
  "order": 1,
  "arrivalDate": "2026-11-01",
  "departureDate": "2026-11-03",
  "notes": "Pick up local SIM on arrival."
}
```

> `cityId`, `order`, `arrivalDate`, `departureDate` are required.

**Response `201`:** Stop object with `city` included.

---

### PUT `/trips/:id/stops/:stopId`

Update a stop. All fields optional.

**Body:**
```json
{
  "cityId": 3,
  "order": 2,
  "arrivalDate": "2026-11-03",
  "departureDate": "2026-11-06",
  "notes": "Updated note."
}
```

**Response `200`:** Updated stop with `city`.

---

### DELETE `/trips/:id/stops/:stopId`

Remove a stop. Cascades to its activities and accommodation.

**Response `204`:** No content.

---

### POST `/trips/:id/stops/reorder`

Update the `order` of multiple stops at once.

**Body:**
```json
{
  "order": [
    { "stopId": 1, "order": 2 },
    { "stopId": 2, "order": 1 },
    { "stopId": 3, "order": 3 }
  ]
}
```

**Response `200`:**
```json
{ "message": "Stops reordered" }
```

---

## Stop Activities

### POST `/trips/:id/stops/:stopId/activities`

Add a catalog activity to a stop.

**Body:**
```json
{
  "activityId": 5,
  "scheduledDate": "2026-11-01T10:00:00.000Z",
  "actualCost": 200,
  "notes": "Book tickets in advance."
}
```

> `activityId` required. Others optional.

**Response `201`:** `TripActivity` object with `activity` included.

---

### PUT `/trips/:id/stops/:stopId/activities/:actId`

Update a scheduled activity.

**Body:**
```json
{
  "scheduledDate": "2026-11-02T09:00:00.000Z",
  "actualCost": 250,
  "notes": "Rescheduled."
}
```

**Response `200`:** Updated `TripActivity` with `activity`.

---

### DELETE `/trips/:id/stops/:stopId/activities/:actId`

Remove an activity from a stop.

**Response `204`:** No content.

---

## Accommodation

One accommodation per stop (upsert — create or replace).

### POST `/trips/:id/stops/:stopId/accommodation`

Set accommodation for a stop (creates or replaces).

**Body:**
```json
{
  "name": "Hotel Raj Palace",
  "address": "123 Main St, Delhi",
  "checkIn": "2026-11-01T14:00:00.000Z",
  "checkOut": "2026-11-03T11:00:00.000Z",
  "costPerNight": 3500,
  "bookingRef": "HRAJ123",
  "notes": "Free breakfast included."
}
```

> `name`, `checkIn`, `checkOut`, `costPerNight` required.

**Response `201`:** Accommodation object.

---

### PUT `/trips/:id/stops/:stopId/accommodation`

Partially update existing accommodation. All fields optional.

**Response `200`:** Updated accommodation object.

---

### DELETE `/trips/:id/stops/:stopId/accommodation`

Remove accommodation for a stop.

**Response `204`:** No content.

---

## Transport

### GET `/trips/:id/transport`

List all transport legs for a trip.

**Response `200`:** Array of transport objects with `fromStop.city` and `toStop.city` included.

---

### POST `/trips/:id/transport`

Add a transport leg.

**Body:**
```json
{
  "fromStopId": 1,
  "toStopId": 2,
  "mode": "TRAIN",
  "carrier": "Indian Railways",
  "departureTime": "2026-11-03T06:00:00.000Z",
  "arrivalTime": "2026-11-03T14:30:00.000Z",
  "cost": 1200,
  "bookingRef": "PNR123456",
  "notes": "Shatabdi Express."
}
```

> All fields optional. `mode` defaults to `OTHER`. `cost` defaults to `0`.

**Response `201`:** Transport object.

---

### PUT `/trips/:id/transport/:tId`

Update a transport leg. All fields optional. Pass `null` to clear `fromStopId`, `toStopId`, `departureTime`, or `arrivalTime`.

**Response `200`:** Updated transport object.

---

### DELETE `/trips/:id/transport/:tId`

Remove a transport leg.

**Response `204`:** No content.

---

## Expenses

### GET `/trips/:id/expenses`

List all expenses for a trip, sorted newest first.

**Response `200`:** Array of expense objects with `tripStop.city` included (if stop-linked).

---

### POST `/trips/:id/expenses`

Log an expense.

**Body:**
```json
{
  "tripStopId": 1,
  "category": "MEAL",
  "description": "Dinner at Karim's",
  "amount": 850,
  "expenseDate": "2026-11-01"
}
```

> `amount` required. `category` defaults to `MEAL`. `tripStopId` optional (trip-level expense if omitted).

**Response `201`:** Expense object.

---

### PUT `/trips/:id/expenses/:eId`

Update an expense. All fields optional.

**Response `200`:** Updated expense object.

---

### DELETE `/trips/:id/expenses/:eId`

Delete an expense.

**Response `204`:** No content.

---

## Packing

### GET `/trips/:id/packing`

Get the packing list for the current user on this trip, sorted by `order`.

**Response `200`:**
```json
[
  {
    "id": 1,
    "tripId": 1,
    "userId": 1,
    "name": "Passport",
    "category": "DOCUMENTS",
    "isPacked": false,
    "order": 0
  }
]
```

---

### POST `/trips/:id/packing`

Add an item to the packing list.

**Body:**
```json
{
  "name": "Passport",
  "category": "DOCUMENTS",
  "order": 0
}
```

> `name` required. `category` defaults to `OTHER`.

**Response `201`:** Packing item object.

---

### PUT `/trips/:id/packing/:itemId`

Update a packing item (rename, reorder, or toggle packed status).

**Body:**
```json
{
  "name": "Passport + Visa",
  "category": "DOCUMENTS",
  "isPacked": true,
  "order": 1
}
```

**Response `200`:** Updated packing item.

---

### DELETE `/trips/:id/packing/:itemId`

Remove a packing item.

**Response `204`:** No content.

---

### POST `/trips/:id/packing/reset`

Mark all items in the list as unpacked (for reuse on return trips).

**Response `200`:**
```json
{ "message": "Packing list reset" }
```

---

## Notes

### GET `/trips/:id/notes`

Get all notes for a trip by the current user, sorted newest first.

**Response `200`:**
```json
[
  {
    "id": 1,
    "tripId": 1,
    "userId": 1,
    "title": "Hotel check-in info",
    "content": "Check-in after 2pm. Ask for room 404.",
    "noteDate": "2026-11-01T00:00:00.000Z",
    "createdAt": "2026-05-10T07:00:00.000Z",
    "updatedAt": "2026-05-10T07:00:00.000Z"
  }
]
```

---

### POST `/trips/:id/notes`

Create a note.

**Body:**
```json
{
  "title": "Hotel check-in info",
  "content": "Check-in after 2pm. Ask for room 404.",
  "noteDate": "2026-11-01"
}
```

> `content` required. `title` and `noteDate` optional.

**Response `201`:** Note object.

---

### PUT `/trips/:id/notes/:noteId`

Update a note. All fields optional. Pass `null` to `noteDate` to clear it.

**Response `200`:** Updated note object.

---

### DELETE `/trips/:id/notes/:noteId`

Delete a note.

**Response `204`:** No content.

---

## Admin

All `/admin` routes require authentication **and** `role: ADMIN`.

---

### GET `/admin/stats`

Platform-wide analytics.

**Response `200`:**
```json
{
  "totalUsers": 120,
  "totalTrips": 340,
  "publicTrips": 60,
  "totalCities": 30,
  "topCities": [
    {
      "id": 1,
      "name": "Mumbai",
      "_count": { "tripStops": 85 }
    }
  ],
  "topActivities": [
    {
      "id": 5,
      "name": "Red Fort",
      "_count": { "tripActivities": 42 }
    }
  ],
  "recentUsers": [
    {
      "id": 100,
      "email": "new@example.com",
      "firstName": "Priya",
      "lastName": "Singh",
      "createdAt": "2026-05-09T10:00:00.000Z",
      "_count": { "trips": 2 }
    }
  ]
}
```

---

### GET `/admin/users`

List all users with pagination and search.

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Results per page (max 100) |
| `search` | string | — | Search by email, first or last name |

**Response `200`:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Raj",
      "lastName": "Sharma",
      "city": "Mumbai",
      "role": "USER",
      "createdAt": "2026-05-10T07:00:00.000Z",
      "_count": { "trips": 5 }
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 20
}
```

---

### PUT `/admin/users/:id/role`

Change a user's role.

**Body:**
```json
{ "role": "ADMIN" }
```

> `role` must be `"USER"` or `"ADMIN"`.

**Response `200`:**
```json
{ "id": 1, "email": "user@example.com", "role": "ADMIN" }
```

---

### DELETE `/admin/users/:id`

Delete a user account.

**Response `204`:** No content.

---

### GET `/admin/cities`

List all cities with activity and usage counts.

**Response `200`:** Array of city objects with `_count.activities` and `_count.tripStops`.

---

### POST `/admin/cities`

Create a city.

**Body:**
```json
{
  "name": "Varanasi",
  "costIndex": 0.8,
  "popularity": 80,
  "description": "Oldest living city.",
  "imageUrl": "https://example.com/varanasi.jpg",
  "latitude": 25.3176,
  "longitude": 82.9739
}
```

> `name` required. All others optional.

**Response `201`:** City object.

---

### PUT `/admin/cities/:id`

Update a city. All fields optional.

**Response `200`:** Updated city object.

---

### DELETE `/admin/cities/:id`

Delete a city (fails if city has trip stops referencing it).

**Response `204`:** No content.

---

### POST `/admin/cities/:id/activities`

Add an activity to a city.

**Body:**
```json
{
  "name": "Ganga Aarti",
  "description": "Evening prayer ceremony on the ghats.",
  "type": "CULTURE",
  "estimatedCost": 0,
  "durationHours": 2,
  "imageUrl": "https://example.com/aarti.jpg"
}
```

> `name` required. `type` defaults to `OTHER`.

**Response `201`:** Activity object.

---

### PUT `/admin/activities/:id`

Update an activity. All fields optional.

**Response `200`:** Updated activity object.

---

### DELETE `/admin/activities/:id`

Delete an activity (fails if activity is used in any trip stop).

**Response `204`:** No content.

---

## Enums

### `ActivityType`
`SIGHTSEEING` `FOOD` `ADVENTURE` `CULTURE` `SHOPPING` `WELLNESS` `NIGHTLIFE` `NATURE` `OTHER`

### `TransportMode`
`FLIGHT` `TRAIN` `BUS` `CAR` `FERRY` `OTHER`

### `PackingCategory`
`CLOTHING` `DOCUMENTS` `TOILETRIES` `ELECTRONICS` `MEDICATIONS` `OTHER`

### `ExpenseCategory`
`MEAL` `MISC` `OTHER`

### `Role`
`USER` `ADMIN`

---

## Error Responses

All errors return a JSON object with an `error` field.

| Status | Meaning |
|--------|---------|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthenticated — missing or invalid token |
| `403` | Forbidden — valid token but wrong role or not the owner |
| `404` | Resource not found |
| `500` | Internal server error |

**Example:**
```json
{ "error": "Authentication required" }
```
