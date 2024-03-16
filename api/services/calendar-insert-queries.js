const getCalendarMemberInsertQuery = () => {
  return `
  insert into public.calendar_members (calendar_id, user_id, created_at, updated_at)
       values (:calendarId, :userId, now(), now())
  `;
};

const removePendingCalendarInviteQuery = () => {
  return `
      delete from public.calendar_invites
            where id = :id
  `;
};

module.exports = {
  getCalendarMemberInsertQuery,
  removePendingCalendarInviteQuery,
};
