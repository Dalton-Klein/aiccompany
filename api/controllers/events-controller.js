require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const moment = require("moment");
const { updateUserGenInfoField } = require("../services/user-common");
const { saveNotification } = require("./notifications-controller");
const {
  getAllEventsForUserQuery,
  getAllEventsForUserThisWeekQuery,
} = require("../services/events-queries");

/*
get events logic
*/
const getAllEventsForUser = async (req, res) => {
  try {
    const { userId, token } = req.body;
    //Top half of union selects events user has created, but not assigned to a calendar (personal events)
    //Bottom half of union grabs all events from calendars that user is a member of
    let query = getAllEventsForUserQuery();
    const eventsResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        userId,
      },
    });
    const result = {
      status: "success",
      data: eventsResult[0],
    };
    updateUserGenInfoField(userId, "last_seen", moment().format());
    if (eventsResult) res.status(200).send(result);
    else throw new Error("Failed to get events");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getAllEventsThisWeekForUser = async (req, res) => {
  try {
    const { userId, token } = req.body;
    //Top half of union selects events user has created, but not assigned to a calendar (personal events)
    //Bottom half of union grabs all events from calendars that user is a member of
    let query = getAllEventsForUserThisWeekQuery();
    const eventsResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        userId,
      },
    });
    const result = {
      status: "success",
      data: eventsResult[0],
    };
    updateUserGenInfoField(userId, "last_seen", moment().format());
    if (eventsResult) res.status(200).send(result);
    else throw new Error("Failed to get events");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const createEvent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, event, token } = req.body;
    const query = `INSERT INTO public.calendar_events
                            (user_id, title, start_time, end_time, "location", notes, created_at, updated_at)
                      VALUES(:userId, :title, :start_time, :end_time, '', :notes, now(), now());
  `;
    const eventInsertResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        userId,
        title: event.title,
        notes: event.notes,
        start_time: event.start_time,
        end_time: event.end_time,
      },
      transaction,
    });
    console.log(eventInsertResult);
    if (!eventInsertResult) {
      transaction.rollback();
      res.status(200).send({ error: "failed to create event" });
    } else if (event.is_series) {
    }
    transaction.commit();
    res.status(200).send({ status: "success", data: eventInsertResult });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(500).send("Create Event ERROR");
  }
};

module.exports = {
  getAllEventsForUser,
  getAllEventsThisWeekForUser,
  createEvent,
};
