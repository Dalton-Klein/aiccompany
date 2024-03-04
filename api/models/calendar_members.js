module.exports = (sequelize, DataTypes) => {
  const calendar_members = sequelize.define(
    "calendar_members",
    {
      calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return calendar_members;
};
