require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { updateUserGenInfoField } = require("../services/user-common");
const moment = require("moment");
const {
  getPendingCalendarInvitesForUserQuery,
} = require("../services/calendar-get-queries");
const {
  getCalendarMemberInsertQuery,
  removePendingCalendarInviteQuery,
} = require("../services/calendar-insert-queries");
const { saveNotification } = require("../controllers/notifications-controller");
const format = require("pg-format");

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

const getDataForCalendar = async (req, res) => {
  try {
    const { calendarId, token } = req.body;
    let query = `
         select c.*
           from public.calendars c
          where c.id = :calendarId
    `;
    const calendarResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        calendarId,
      },
    });
    query = `
         select cm.*, u.username, u.avatar_url
           from public.calendar_members cm
           join public.users u
             on u.id = cm.user_id
          where cm.calendar_id = :calendarId
    `;
    const memberResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        calendarId,
      },
    });
    query = `
         select ci.*, u.username, u.avatar_url
           from public.calendar_invites ci
           join public.users u
             on u.id = ci.receiver
          where ci.calendar_id = :calendarId
    `;
    const inviteResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        calendarId,
      },
    });
    const result = {
      status: "success",
      data: calendarResult[0],
      memberResult,
      inviteResult,
    };
    if (calendarResult) res.status(200).send(result);
    else throw new Error("Failed to get events");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateDataForCalendar = async (req, res) => {
  try {
    const { calendarId, changes, token } = req.body;
    let updateResult;
    for (const change of changes) {
      console.log("cahange? ", change);
      const field = change.field;
      const query = format(
        `
        update public.calendars
          set %I = :value,
              updated_at = current_timestamp
        where id = :calendarId
      `,
        field
      );
      console.log("query? ", query);
      updateResult = await sequelize.query(query, {
        type: Sequelize.QueryTypes.UPDATE,
        replacements: {
          calendarId,
          value: change.value,
        },
      });
    }

    const result = {
      status: "success",
      data: updateResult,
    };
    console.log("test? ", updateResult);
    if (updateResult) res.status(200).send(result);
    else throw new Error("Failed to update calendar data");
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

/*
send calendar request logic
*/
const sendCalendarInvite = async (req, res) => {
  try {
    const { calendarId, fromUserId, forUserId, token } = req.body;

    //***Check if request already exists
    let query = getPendingCalendarInvitesForUserQuery();
    console.log("args: ", calendarId, fromUserId, forUserId);
    const pendingResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: forUserId,
        calendarId: calendarId,
      },
    });
    console.log("all pending: ", pendingResult);
    if (pendingResult.some((request) => request.user_id === forUserId)) {
      res
        .status(200)
        .send({ staus: "error", data: "Pending request already exists!" });
    } else {
      query = `
        insert into public.calendar_invites  (calendar_id, sender, receiver, created_at, updated_at)
        values (:calendarId, :sender, :receiver, current_timestamp, current_timestamp)
      `;
      const inviteInsertResult = await sequelize.query(query, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          calendarId: calendarId,
          sender: fromUserId,
          receiver: forUserId,
        },
      });
      const result = {
        status: "success",
        data: "created calendar request",
      };
      saveNotification(forUserId, 1, fromUserId);
      updateUserGenInfoField(fromUserId, "last_seen", moment().format());
      if (inviteInsertResult) res.status(200).send(result);
      else throw new Error("Failed to create calendar request");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const acceptCalendarInvite = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { calendarId, userId, pendingId } = req.body;
    const calendarInsertQuery = getCalendarMemberInsertQuery();
    //Insert friend record
    const memberInsertResult = await sequelize.query(calendarInsertQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        calendarId,
        userId,
      },
      transaction,
    });
    const pendingDeletionQuery = removePendingCalendarInviteQuery();
    //Remove pending friend now that friend record created
    await sequelize.query(pendingDeletionQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        id: pendingId,
      },
      transaction,
    });
    // saveNotification(senderId, 2, acceptorId);
    updateUserGenInfoField(userId, "last_seen", moment().format());
    transaction.commit();
    res.status(200).send(memberInsertResult);
  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(500).send("POST ERROR");
  }
};

module.exports = {
  getAllCalendarsForUser,
  getDataForCalendar,
  updateDataForCalendar,
  createCalendar,
  sendCalendarInvite,
  acceptCalendarInvite,
};
