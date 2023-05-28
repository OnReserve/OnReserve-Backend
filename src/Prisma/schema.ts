import { Event, PrismaClient, User, EventReview, Company, Booking, Category  } from '@prisma/client'
const prisma = new PrismaClient()


// -------------------Users -------------------//
// --------------------------------------------//

async function createUser(user: User) {
    return await prisma.user.create({
      data: user
    })
  }
  
async function updateUser(userId: number, user: User) {
  return await prisma.user.update({
    where: {id: userId},
    data: user
  })
}

async function deleteUser(userId: number) {
  return await prisma.user.delete({
    where: {id: userId}
  })
}

async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: { id }
  });
  return user;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return user;
}

// -------------------Events -------------------//
// --------------------------------------------//

async function createEvent(event: Event) {
  return await prisma.event.create({
    data: event
  })
}

async function updateEvent(eventId: number, eventData: Event) {
  return await prisma.event.update({
    where: {id: eventId},
    data: eventData
  }) 
}

async function deleteEvent(eventId: number) {
  return await prisma.event.delete({
    where: {id: eventId}
  })
}

// Event Reviews
async function createEventReview(reviewData: EventReview) {
  return await prisma.eventReview.create({
    data: reviewData
  })
}

async function updateEventReview(reviewId: number,review: EventReview) {
  return await prisma.eventReview.update({
    where: {id: reviewId},
    data: review
  })
}

async function deleteEventReview(reviewId: number) {
  return await prisma.eventReview.delete({
    where: {id: reviewId}
  }) 
}


// -------------------Companies -------------------
// -----------------------------------------------

async function createCompany(company: Company) {
  return await prisma.company.create({
    data: company
  })
}

async function updateCompany(companyId: number, companyData: Company) {
  return await prisma.company.update({
    where: {id: companyId},
    data: companyData
  })
}  

async function deleteCompany(companyId: number) {
  return await prisma.company.delete({
    where: {id: companyId}
  })
}


// -------------------Bookings -------------------
// -----------------------------------------------

async function createBooking(booking: Booking) {
  return await prisma.booking.create({
    data: booking
  })
}

async function updateBooking(bookingId: number, bookingData: Booking) {
  return await prisma.booking.update({
    where: {id: bookingId},
    data: bookingData
  })
}

async function deleteBooking(bookingId: number) {
  return await prisma.booking.delete({
    where: {id: bookingId}
  })
}

// -------------------Categories -------------------
// -----------------------------------------------

async function createCategory(categoryData: Category) {
  return await prisma.category.create({
    data: categoryData
  }) 
}

async function updateCategory(categoryId: number, categoryData: Category) {
  return await prisma.category.update({
    where: {id: categoryId}, 
    data: categoryData
  })
}

async function deleteCategory(categoryId: number) {
  return await prisma.category.delete({
    where: {id: categoryId}
  })
}