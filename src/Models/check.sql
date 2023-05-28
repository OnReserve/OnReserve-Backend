CREATE TABLE "booking_histories" (
    "id" integer not null primary key autoincrement,
    "user_id" integer not null,
    "booking_id" integer not null,
    "created_at" datetime null,
    "updated_at" datetime null,
    foreign key("user_id") references "users"("id") on delete cascade,
    foreign key("booking_id") references "bookings"("id") on delete cascade);

CREATE TABLE "bookings" ("id" integer not null primary key autoincrement,
 "user_id" integer not null,
 "event_id" integer not null,
 "completed" tinyint(1) not null,
 "booking_token" varchar not null,
 "qrcode" varchar not null,
 "economy_count" integer not null,
 "vip_count" integer not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 foreign key("user_id") references "users"("id") on delete cascade,
 foreign key("event_id") references "events"("id") on delete cascade)

CREATE TABLE "categories" (    
 "id" integer not null primary key autoincrement,
 "name" varchar not null,
 "created_at" datetime null,
 "updated_at" datetime null)

CREATE TABLE "category_event" (
 "id" integer not null primary key autoincrement,
 "category_id" integer not null,
 "event_id" integer not null,
 "created_at" datetime null,
 "updated_at" datetime null)

CREATE TABLE "companies" (
 "id" integer not null primary key autoincrement,
 "owner" integer not null,
 "name" varchar not null,
 "bio" varchar not null,
 "prof_pic" varchar null,
 "cover_pic" varchar null,
 "rating" varchar not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 foreign key("owner") references "users"("id") on delete cascade)

CREATE TABLE "company_user" (
 "id" integer not null primary key autoincrement,
 "company_id" integer not null,
 "user_id" integer not null,
 "created_at" datetime null,
 "updated_at" datetime null)

CREATE TABLE "event_galleries" (
 "id" integer not null primary key autoincrement,
 "event_id" integer not null,
 "event_photo" varchar not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 foreign key("event_id") references "events"("id") on delete cascade)

CREATE TABLE "event_locations" (
 "id" integer not null primary key autoincrement,
 "event_id" integer not null,
 "city" varchar not null,
 "street" varchar not null,
 "venue" varchar not null,
 "latitude" float not null,
 "longitude" float not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 foreign key("event_id") references "events"("id") on delete cascade)

CREATE TABLE "event_reviews" (
 "id" integer not null primary key autoincrement,
 "user_id" integer not null,
 "event_id" integer not null,
 "comment" varchar not null,
 "stars" integer not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 foreign key("user_id") references "users"("id") on delete cascade,
 foreign key("event_id") references "events"("id") on delete cascade)

CREATE TABLE "events" (
 "id" integer not null primary key autoincrement,
 "user_id" integer not null,
 "company_id" integer not null,
 "title" varchar not null,
 "desc" varchar not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 "event_start_time" datetime not null,
 "event_end_time" datetime not null,
 "event_deadline" datetime not null,
 "approved" tinyint(1) not null,
 "approved_by" integer null,
 "economy_seats" integer not null,
 "economy_price" integer not null,
 "vip_seats" integer not null,
 "vip_price" integer not null,
 foreign key("user_id") references "users"("id") on delete cascade,
 foreign key("company_id") references "companies"("id") on delete cascade,
 foreign key("approved_by") references "users"("id") on delete cascade)

CREATE TABLE "password_resets" (
 "email" varchar not null,
 "token" varchar not null,
 "created_at" datetime null)

CREATE TABLE "personal_access_tokens" ("id" integer not null primary key autoincrement,
 "tokenable_type" varchar not null,
 "tokenable_id" integer not null,
 "name" varchar not null,
 "token" varchar not null,
 "abilities" text null,
 "last_used_at" datetime null,
 "created_at" datetime null,
 "updated_at" datetime null)

CREATE TABLE "profiles" ("id" integer not null primary key autoincrement,
 "phone_number" varchar not null,
 "profile_pic" varchar not null,
 "bio" varchar not null,
 "created_at" datetime null,
 "updated_at" datetime null,
 "user_id" integer not null,
 foreign key("user_id") references "users"("id") on delete cascade)

CREATE TABLE "users" ("id" integer not null primary key autoincrement,
 "fname" varchar not null,
 "lname" varchar not null,
 "email" varchar not null,
 "email_verified_at" datetime null,
 "password" varchar not null,
 "remember_token" varchar null,
 "created_at" datetime null,
 "updated_at" datetime null)