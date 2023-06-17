import { Router } from "express";
import { auth } from "../Controller/Auth/auth.controller.js";
import registerController from "../Controller/Auth/register.controller.js";
import loginController from "../Controller/Auth/login.controller.js";
import logoutController from "../Controller/Auth/logout.controller.js";
import { companyController } from "../Controller/company.controller.js";
import {
	companyFilesMiddleware,
	profileFilesMiddleware,
	eventFilesMiddleware,
	upload,
} from "../Middleware/file.middleware.js";
import { eventController } from "../Controller/events.controller.js";
import { bookingController } from "../Controller/booking.controller.js";
import { reviewController } from "../Controller/review.controller.js";
import profileController from "../Controller/profile.controller.js";
import categoryController from "../Controller/category.controller.js";
import { AdminAuth } from "../Controller/Admin/auth.middleware.js";
import { adminController } from "../Controller/Admin/admin.controller.js";

const router = Router();

// Auth Routes
router.post("/auth/register", registerController.register);
router.post("/auth/login", loginController.login);
router.post("/auth/logout", logoutController.logout);

// Event Routes
router.get("/events/popular", eventController.getPopularEvents); // Get all events, or get events by category
router.get("/events/upcoming", eventController.getUpcomingEvents);
router.get("/events/search/:keyword", eventController.searchEvent);
router.get("/event/:id", eventController.getEventDetails); // Event Details
router.get("/events/filter", eventController.filterEvents);

router.get("/categories", categoryController.allCategories); // Get all categories, or get categories by category
router.get("/category/:id", categoryController.getCategory);

router.get("/event/:id/ratings", reviewController.getEventReviews); // Get all ratings for an event

// Authentication middleware
router.use(auth);

// Profile Routes
router.get("/profile/:id", profileController.getProfile);
router.post(
	"/profile/:id",
	profileFilesMiddleware,
	auth,
	profileController.editProfile
);

// Event Routes
router.post("/event/add", eventFilesMiddleware, auth, eventController.addEvent);
router.post("/event/:id", eventController.editEvent); // Edit
router.delete("/event/:id", eventController.deleteEvent);
router.get("/events/user", eventController.getUserEvents);

// Review Routes
router.post("/event/:id/ratings", reviewController.addReview); // Add a rating to an event
router.put("/event/ratings/:id", reviewController.editReview); // Edit a rating for an event
router.patch("/event/:id/ratings/:id"); // Edit a rating for an event
router.delete("/event/ratings/:id", reviewController.deleteReview); // Delete a rating for an event

// Companies Routes
router.get("/companies", companyController.getUserCompanies); // Get all companies, or get companies by category
router.post(
	"/company/add",
	companyFilesMiddleware,
	auth,
	companyController.addCompany
);
router.post("/company/:id/admins", companyController.addCompanyAdmin);
router.get("/company/:id", companyController.getCompany);
router.put(
	"/company/:id",
	companyFilesMiddleware,
	auth,
	companyController.editCompany
); // edit company
router.get("/company/search/:keyword", companyController.searchCompany);
router.delete("/company/:id", companyController.deleteCompany);

// Booking Routes
router.get("/bookings", bookingController.getBookings); // Get all bookings, or get bookings by category
router.post("/booking/add", bookingController.addBooking);
router.get("/booking/:id", bookingController.getBookingDetails);
router.put("/booking/:id");

// Category Routes

router.use(AdminAuth);

router.get("/admin/stats", adminController.getStat);
router.get("/admin/admins", adminController.getAdmins);
router.post("/admin/admins", adminController.addAdmin);
router.delete("/admin/admins/:id", adminController.removeAdmin);
router.get(
	"/admin/bookings/unapproved",
	adminController.getAllUnapprovedTickets
);
router.put(`/admin/booking/:id`, adminController.approveTicket);
router.post("/category/add", categoryController.addCategory);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

export default router;
