const express = require("express");
// controllers
const authController = require("../controllers/auth-controller");
const friendsController = require("../controllers/friends-controller");
const notificationsController = require("../controllers/notifications-controller");
const userController = require("../controllers/user-controller");
const calendarController = require("../controllers/calendar-controller");
const eventsController = require("../controllers/events-controller");
// testing
const testController = require("../controllers/test-controller");
// start router
const router = express.Router();
router.use(express.json());

// AUTH RELATED ROUTES
router.post("/verify", authController.verify);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/google-signin", authController.googleSignin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/try-apple-signin", authController.tryAppleSignin);

// USER RELATED ROUTES
router.post("/getUserDetails", userController.getUserDetails);
router.post("/updateUserInfoField", userController.updateProfileField);
router.put("/updateGeneralInfoField", userController.updateGeneralInfoField);
router.post("/search-user-by-username", userController.searchForUser);
router.post("/get-metric-data", userController.getMetricData);

// NOTIFICATIONS RELATED ROUTES
router.post(
  "/get-notifications",
  notificationsController.getNotificationsForUser
);

//CALENDAR ROUTES
router.post("/get-my-calendars", calendarController.getAllCalendarsForUser);
router.post("/create-calendar", calendarController.createCalendar);
router.post("/accept-calendar-invite", calendarController.acceptCalendarInvite);

//EVENTS ROUTES
router.post("/get-my-events", eventsController.getAllEventsForUser);
router.post("/create-event", eventsController.createEvent);
router.post("/create-task", eventsController.createTask);
router.post(
  "/create-event-assignments",
  eventsController.createEventAssignments
);

// SOCIAL ROUTES
router.post("/social", userController.getSocialDetails);
router.post("/friend-request", friendsController.sendFriendRequest);
router.post("/accept-friend", friendsController.acceptFriendRequest);
router.post("/friends", friendsController.getFriendsForUser);
router.post("/pending-friends", friendsController.getPendingFriendsForUser);

// TESTING ROUTES Coffee Disable
router.post("/test-email", testController.testEmails);

module.exports = router;
