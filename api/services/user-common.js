const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const format = require("pg-format");
const { getUserDataByIdQuery, searchUserByUsernameQuery } = require("./user-queries");

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
  const query = searchUserByUsernameQuery();
  let result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      inputString,
    },
  });
  return result;
};
const updateUserGenInfoField = async (userId, field, value) => {
  const query = format(
    `
    update public.user_general_infos
      set %I = :value,
          updated_at = current_timestamp
    where user_id = :userId
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
  getUserInfo,
  updateUserGenInfoField,
  searchForUserByUsername,
};
