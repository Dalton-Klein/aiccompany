require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { updateUserGenInfoField } = require("../services/user-common");
const moment = require("moment");

/*
get calendars
*/
const getAllCalendarsForUser = async (req, res) => {
  try {
    const { userId, token } = req.body;
    let query = `
         select c.*,
                (select count(*)
                   from public.calendar_members cm2
                  where cm2.calendar_id = c.id) as member_count
           from public.calendars c
           join public.calendar_members cm 
             on cm.calendar_id = c.id
          where cm.user_id = :userId
       order by c.updated_at desc
    `;
    const caldarResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        userId,
      },
    });
    const result = {
      status: "success",
      data: caldarResult[0],
    };
    updateUserGenInfoField(userId, "last_seen", moment().format());
    if (caldarResult) res.status(200).send(result);
    else throw new Error("Failed to get events");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const createCalendar = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, title, description, inviteUserIds } = req.body;
    //Insert calendar record
    let query = `
        INSERT INTO public.calendars
                    (owner_user_id, title, description, created_at, updated_at)
             VALUES (:userId, :title, :description, now(), now());
    `;
    const calendarInsertResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        userId,
        title,
        description,
      },
      transaction,
    });
    updateUserGenInfoField(userId, "last_seen", moment().format());
    transaction.commit();
    res.status(200).send(calendarInsertResult);
  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(500).send("Create Calendar ERROR");
  }
};

module.exports = {
  getAllCalendarsForUser,
  createCalendar,
};
