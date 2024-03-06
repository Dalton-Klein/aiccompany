require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const moment = require("moment");
const { updateUserGenInfoField } = require("../services/user-common");
const { saveNotification } = require("./notifications-controller");

/*
send friend request logic
*/
const getAllEventsForUser = async (req, res) => {
  try {
    const { userId, token } = req.body;
    let query = `
         select * 
           from public.calendar_events 
          where user_id = :userId
       order by start_time asc
    `;
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

module.exports = {
  getAllEventsForUser,
}