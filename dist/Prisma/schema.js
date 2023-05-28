import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// -------------------Users -------------------//
// --------------------------------------------//
async function createUser(user) {
    return await prisma.user.create({
        data: user
    });
}
async function updateUser(userId, user) {
    return await prisma.user.update({
        where: { id: userId },
        data: user
    });
}
async function deleteUser(userId) {
    return await prisma.user.delete({
        where: { id: userId }
    });
}
async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}
async function getUserById(id) {
    const user = await prisma.user.findFirst({
        where: { id }
    });
    return user;
}
async function getUserByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return user;
}
// -------------------Events -------------------//
// --------------------------------------------//
async function createEvent(event) {
    return await prisma.event.create({
        data: event
    });
}
async function updateEvent(eventId, eventData) {
    return await prisma.event.update({
        where: { id: eventId },
        data: eventData
    });
}
async function deleteEvent(eventId) {
    return await prisma.event.delete({
        where: { id: eventId }
    });
}
// Event Reviews
async function createEventReview(reviewData) {
    return await prisma.eventReview.create({
        data: reviewData
    });
}
async function updateEventReview(reviewId, review) {
    return await prisma.eventReview.update({
        where: { id: reviewId },
        data: review
    });
}
async function deleteEventReview(reviewId) {
    return await prisma.eventReview.delete({
        where: { id: reviewId }
    });
}
// -------------------Companies -------------------
// -----------------------------------------------
async function createCompany(company) {
    return await prisma.company.create({
        data: company
    });
}
async function updateCompany(companyId, companyData) {
    return await prisma.company.update({
        where: { id: companyId },
        data: companyData
    });
}
async function deleteCompany(companyId) {
    return await prisma.company.delete({
        where: { id: companyId }
    });
}
// -------------------Bookings -------------------
// -----------------------------------------------
async function createBooking(booking) {
    return await prisma.booking.create({
        data: booking
    });
}
async function updateBooking(bookingId, bookingData) {
    return await prisma.booking.update({
        where: { id: bookingId },
        data: bookingData
    });
}
async function deleteBooking(bookingId) {
    return await prisma.booking.delete({
        where: { id: bookingId }
    });
}
// -------------------Categories -------------------
// -----------------------------------------------
async function createCategory(categoryData) {
    return await prisma.category.create({
        data: categoryData
    });
}
async function updateCategory(categoryId, categoryData) {
    return await prisma.category.update({
        where: { id: categoryId },
        data: categoryData
    });
}
async function deleteCategory(categoryId) {
    return await prisma.category.delete({
        where: { id: categoryId }
    });
}
//# sourceMappingURL=schema.js.map