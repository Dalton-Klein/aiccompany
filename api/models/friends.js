module.exports = (sequelize, DataTypes) => {
  const friends = sequelize.define(
    "friends",
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
      acceptor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return friends;
};
