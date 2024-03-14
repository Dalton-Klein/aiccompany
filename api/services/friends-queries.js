const getFriendsForUserQuerySenders = () => {
  return `
       select c.sender as user_id,
              c.updated_at,
              c.id,
              u.username,
              u.avatar_url
          from public.friends c
          join public.users u 
            on u.id = c.sender
        where c.acceptor = :userId
`;
};

const getFriendsForUserQueryAcceptors = () => {
  return `
        select c.acceptor as user_id,
              c.updated_at,
              c.id,
              u.username,
              u.avatar_url
          from public.friends c
          join public.users u 
            on u.id = c.acceptor
        where c.sender = :userId
`;
};

const getIncomingPendingFriendsForUserQuery = () => {
  return `
          select c.id as requestId,
                c.sender as user_id,
                u.id as id,
                u.username,
                u.avatar_url
            from public.friend_requests c
            join public.users u 
              on u.id = c.sender
          where c.receiver = :userId
`;
};

const getOutgoingPendingFriendsForUserQuery = () => {
  return `
          select c.id as requestId,
                c.receiver as user_id,
                u.id,
                u.username,
                u.avatar_url
            from public.friend_requests c
            join public.users u 
              on u.id = c.receiver
          where c.sender = :userId
`;
};

const getPendingCalendarInvitesForUserQuery = () => {
  return `
                     select c.id as requestId,
                            c.gang_id as user_id,
                            g.name as username,
                            g.avatar_url,
                            g.about,
                            g.chat_platform_id,
                            g.game_platform_id as platform
                       from public.gang_requests c
                       join public.gangs g 
                         on g.id = c.gang_id
                      where c.user_id = :userId
`;
};

const getFriendInsertQuery = () => {
  return `
  insert into public.friends (sender, acceptor, platform, created_at, updated_at)
       values (:senderId, :acceptorId, :platform, now(), now())
  `;
};

const removePendingFriendQuery = () => {
  return `
    delete from public.friend_requests
          where id = :id
  `;
};

module.exports = {
  getFriendsForUserQuerySenders,
  getFriendsForUserQueryAcceptors,
  getIncomingPendingFriendsForUserQuery,
  getOutgoingPendingFriendsForUserQuery,
  getPendingCalendarInvitesForUserQuery,
  getFriendInsertQuery,
  removePendingFriendQuery,
};
