module.exports = (sequelize, DataTypes) => {
  const calendars = sequelize.define(
    "calendars",
    {
      owner_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return calendars;
};
