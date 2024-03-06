module.exports = (sequelize, DataTypes) => {
  const task_items = sequelize.define(
    "task_items",
    {
      calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return task_items;
};
