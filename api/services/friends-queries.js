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
                c.platform,
                u.id,
                u.username,
                u.avatar_url,
                ug.last_seen,
                ug.about,
                ug.age,
                ug.gender,
                r.name as region_name,
                r.abbreviation as region_abbreviation,
                ug.languages,
                ug.preferred_platform,
                ug.discord,
                ug.psn,
                ug.xbox,
                av1.name as weekends,
                av2.name as weekdays,
                ur.roles,
                ur.play_styles
            from public.friend_requests c
            join public.users u 
              on u.id = c.receiver
            join public.user_general_infos ug 
              on ug.user_id = u.id
            join public.user_rust_infos ur
              on ur.user_id = u.id
       left join public.regions r
              on r.id = ug.region
       left join public.availabilities av1
              on av1.id = ur.weekends
       left join public.availabilities av2
              on av2.id = ur.weekdays
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
