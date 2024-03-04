module.exports = (sequelize, DataTypes) => {
  const friend_requests = sequelize.define(
    "friend_requests",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return friend_requests;
};
