import os

lists = [
    "bookings.ts",
    "booking_histories.ts",
    "categories.ts",
    "category_event.ts",
    "companies.ts",
    "company_user.ts",
    "events.ts",
    "event_galleries.ts",
    "event_locations.ts",
    "event_reviews.ts",
    "password_resets.ts",
    "personal_access_tokens.ts",
    "profiles.ts",
    "users.ts",
]
for i in lists:
    os.rename(i, i.replace(".ts", ".prisma"))