module.exports = (sequelize, DataTypes) => {
  const calendar_events = sequelize.define(
    "calendar_events",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      series_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_task: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      task_duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return calendar_events;
};
