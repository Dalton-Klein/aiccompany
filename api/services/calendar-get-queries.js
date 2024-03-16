const getAllEventsCreatedByUser = () => {
  return `
    select * 
      from public.calendar_events
     where user_id = :user_id
  `;
};

const getAllEventsForCalendar = () => {
  return `
    select ce.* 
      from public.calendar_events ce
      join public.calendar_event_assignments cea
        on cea.event_id = ce.id
     where cea.calendar_id = :calendar_id
  `;
};

const getAllMembersOnCalendar = () => {
  return `
    select cm.* 
      from public.calendar_members cm
     where cm.calendar_id = :calendar_id
  `;
};

const getAllCalendarsForUser = () => {
  return `
    select cm.* 
      from public.calendar_members cm
     where cm.user_id = :user_id
  `;
};

const getAllCalendarInvitesForUser = () => {
  return `
    select ci.*, c.title
      from public.calendar_invites ci
      join public.calendars c
        on c.id = ci.calendar_id
     where ci.receiver = :userId
  `;
};

module.exports = {
  getAllEventsCreatedByUser,
  getAllEventsForCalendar,
  getAllMembersOnCalendar,
  getAllCalendarsForUser,
  getAllCalendarInvitesForUser,
};
