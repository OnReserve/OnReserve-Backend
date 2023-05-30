import { Router } from "express";
import { auth } from "../Controller/Auth/auth.controller.js";
import registerController from "../Controller/Auth/register.controller.js";
import loginController from "../Controller/Auth/login.controller.js";
import logoutController from "../Controller/Auth/logout.controller.js";
import profileController from "../Controller/Profile/profile.controller.js";
import { companyController } from "../Controller/company.controller.js";
import {
	companyFilesMiddleware,
	upload,
} from "../Middleware/file.middleware.js";

const router = Router();

// Auth Routes
router.post("/auth/register", registerController.register);
router.post("/auth/login", loginController.login);
router.post("/auth/logout", logoutController.logout);

// Authentication middleware
router.use(auth);

// Profile Routes
router.get("/profile/:id", profileController.getProfile);
router.post("/profile/:id/edit");
router.post("/profile/:id/upload");

// Event Routes
router.get("/events"); // Get all events, or get events by category
router.post("/event/add");

router.get("/event/:id");
router.post("/event/:id");
router.patch("/event/:id");
router.delete("/event/:id");

// Review Routes
router.get("/event/:id/ratings"); // Get all ratings for an event
router.post("/event/:id/ratings"); // Add a rating to an event

router.get("/event/:id/ratings/:id"); // Get a rating for an event
router.put("/event/:id/ratings/:id"); // Edit a rating for an event
router.patch("/event/:id/ratings/:id"); // Edit a rating for an event
router.delete("/event/:id/ratings/:id"); // Delete a rating for an event

// Companies Routes
router.get("/companies", companyController.getUserCompanies); // Get all companies, or get companies by category
router.post(
	"/company/add",
	companyFilesMiddleware,
	auth,
	companyController.addCompany
);

router.get("/company/:id", companyController.getCompany);

router.put(
	"/company/:id",
	companyFilesMiddleware,
	auth,
	companyController.editCompany
); // edit company

router.patch("/company/:id");
router.delete("/company/:id", companyController.deleteCompany);

// Booking Routes
router.get("/bookings"); // Get all bookings, or get bookings by category
router.post("/booking/add");

router.get("/booking/:id");
router.put("/booking/:id");
router.patch("/booking/:id");
router.delete("/booking/:id");

// Category Routes
router.get("/categories"); // Get all categories, or get categories by category
router.post("/category/add");

router.get("/category/:id");
router.put("/category/:id");
router.patch("/category/:id");
router.delete("/category/:id");

export default router;
