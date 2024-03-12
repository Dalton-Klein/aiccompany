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
    //Top half of union selects events user has created, but not assigned to a calendar (personal events)
    //Bottom half of union grabs all events from calendars that user is a member of
    let query = `
            select null as calendar_id, ce.* 
              from public.calendar_events ce
         left join public.calendar_event_assignments cea 
                on cea.event_id = ce.id
             where ce.user_id = :userId
        union
            select cea.calendar_id, ce.*
              from public.calendar_events ce
              join public.calendar_event_assignments cea 
                on cea.event_id = ce.id 
              join public.calendar_members cm 
                on cm.calendar_id = cea.calendar_id 
             where cm.user_id = :userId
          order by start_time asc;
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
};
