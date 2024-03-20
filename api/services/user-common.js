const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const format = require("pg-format");
const {
  getUserDataByIdQuery,
  getUserByUsernameQuery,
  getUserCountQuery,
  getEventCountQuery,
} = require("./user-queries");
const {
  getFriendsForUserQuerySenders,
  getFriendsForUserQueryAcceptors,
  getIncomingPendingFriendsForUserQuery,
} = require("./friends-queries");
const {
  getAllCalendarInvitesForUser,
  getAllCalendarsForUser,
} = require("./calendar-get-queries");
const {
  getAllEventsForUserThisWeekQuery,
  getAllEventsForUserQuery,
} = require("./events-queries");

const getMetricDataForUser = async (userId) => {
  let query = getFriendsForUserQuerySenders();
  let senderResult = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getFriendsForUserQueryAcceptors();
  let acceptorResult = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getIncomingPendingFriendsForUserQuery();
  let friendRequestsResult = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getAllCalendarInvitesForUser();
  let calendarInviteResult = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getAllCalendarsForUser();
  let calendarResult = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      user_id: userId,
    },
  });
  query = getAllEventsForUserThisWeekQuery();
  let eventsResultWeek = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getAllEventsForUserQuery();
  let eventsResultAll = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  query = getUserCountQuery();
  let totalUserCount = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  query = getEventCountQuery();
  let totalEventCount = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  return {
    friends: acceptorResult.concat(senderResult),
    friendRequests: friendRequestsResult,
    calendarInvites: calendarInviteResult,
    calendars: calendarResult,
    eventsThisWeek: eventsResultWeek,
    eventsAll: eventsResultAll,
    userCount: totalUserCount[0],
    eventCount: totalEventCount[0],
  };
};

const getUserInfo = async (userId) => {
  const query = getUserDataByIdQuery();
  let result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      userId,
    },
  });
  return result;
};

const searchForUserByUsername = async (inputString) => {
  const query = getUserByUsernameQuery();
  let result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      username: inputString,
    },
  });
  return result;
};

const updateUserGenInfoField = async (userId, field, value) => {
  const query = format(
    `
    update public.users
      set %I = :value,
          updated_at = current_timestamp
    where id = :userId
  `,
    field
  );
  const result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.UPDATE,
    replacements: {
      userId,
      field,
      value,
    },
  });
  return result;
};

module.exports = {
  getMetricDataForUser,
  getUserInfo,
  updateUserGenInfoField,
  searchForUserByUsername,
};
