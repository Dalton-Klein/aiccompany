module.exports = (sequelize, DataTypes) => {
  const calendar_event_assignments = sequelize.define(
    "calendar_event_assignments",
    {
      calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return calendar_event_assignments;
};
