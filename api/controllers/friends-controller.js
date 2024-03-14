require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const {
  getFriendsForUserQuerySenders,
  getFriendsForUserQueryAcceptors,
  getIncomingPendingFriendsForUserQuery,
  getOutgoingPendingFriendsForUserQuery,
  getPendingCalendarInvitesForUserQuery,
  getFriendInsertQuery,
  removePendingFriendQuery,
} = require("../services/friends-queries");
const moment = require("moment");
const { updateUserGenInfoField } = require("../services/user-common");
const { saveNotification } = require("./notifications-controller");

/*
send friend request logic
*/
const sendFriendRequest = async (req, res) => {
  try {
    const { fromUserId, forUserId, token } = req.body;

    //***Check if request already exists
    let query = getIncomingPendingFriendsForUserQuery();
    const incomingResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: fromUserId,
      },
    });
    query = getOutgoingPendingFriendsForUserQuery();
    const outgoingResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: fromUserId,
      },
    });
    const allPendingRequests = incomingResult.concat(outgoingResult);
    console.log("all pending: ", allPendingRequests);
    if (allPendingRequests.some((request) => request.user_id === forUserId)) {
      res
        .status(200)
        .send({ staus: "error", data: "Pending request already exists!" });
    } else {
      query = `
        insert into public.friend_requests  (sender, receiver, created_at, updated_at)
        values (:sender, :receiver, current_timestamp, current_timestamp)
      `;
      const friendInsertResult = await sequelize.query(query, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          sender: fromUserId,
          receiver: forUserId,
        },
      });
      const result = {
        status: "success",
        data: "created friend request",
      };
      saveNotification(forUserId, 1, fromUserId);
      updateUserGenInfoField(fromUserId, "last_seen", moment().format());
      if (friendInsertResult) res.status(200).send(result);
      else throw new Error("Failed to create friend request");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};
/*
get existing friends logic
*/
const getFriendsForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Their Friends ♛ ");
    const { userId, token } = req.body;
    let query;
    query = getFriendsForUserQuerySenders();
    const senderFriends = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    query = getFriendsForUserQueryAcceptors();
    const acceptorFriends = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    //Concat friend results for acceptors and senders
    let friends = acceptorFriends.concat(senderFriends);
    //Sort friend based on updated_at, which is kept up to date each time a message is sent
    friends = friends.sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));
    await updateUserGenInfoField(userId, "last_seen", moment().format());
    res.status(200).send(friends);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
get a single friend logic
*/
const getFriendDetails = async (friendId) => {
  try {
    let query = `select * from public.friends where id = :friendId`;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        friendId,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const acceptFriendRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { senderId, acceptorId, platform, pendingId } = req.body;
    const friendInsertQuery = getFriendInsertQuery();
    //Insert friend record
    const friendInsertResult = await sequelize.query(friendInsertQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        senderId,
        acceptorId,
        platform,
      },
      transaction,
    });
    const pendingDeletionQuery = removePendingFriendQuery();
    //Remove pending friend now that friend record created
    await sequelize.query(pendingDeletionQuery, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        id: pendingId,
      },
      transaction,
    });
    saveNotification(senderId, 2, acceptorId);
    updateUserGenInfoField(acceptorId, "last_seen", moment().format());
    transaction.commit();
    res.status(200).send(friendInsertResult);
  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(500).send("POST ERROR");
  }
};

/*
get pending friends logic
*/
const getPendingFriendsForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Their Pending Friends ♛ ");
    const { userId, token } = req.body;
    let query;
    query = getIncomingPendingFriendsForUserQuery();
    const incmoingFriends = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    query = getOutgoingPendingFriendsForUserQuery();
    const outgoingFriends = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    query = getPendingCalendarInvitesForUserQuery();
    const gangFriends = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    res.status(200).send({
      incoming: incmoingFriends,
      outgoing: outgoingFriends,
      gang: gangFriends,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const updateFriendTimestamp = async (friendId) => {
  try {
    let query = `
        update public.friends
              set updated_at = current_timestamp
            where id = :friendId
    `;
    const updateResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        friendId,
      },
    });
    return updateResult;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsForUser,
  getFriendDetails,
  getPendingFriendsForUser,
  updateFriendTimestamp,
};
