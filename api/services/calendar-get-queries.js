const getAllEventsCreatedByUser = () => {
  return `
    select * 
      from aic.calendar_events
     where user_id = :user_id
  `;
};

const getAllEventsForCalendar = () => {
  return `
    select ce.* 
      from aic.calendar_events ce
      join aic.calendar_event_assignments cea
        on cea.event_id = ce.id
     where cea.calendar_id = :calendar_id
  `;
};

const getAllMembersOnCalendar = () => {
  return `
    select cm.* 
      from aic.calendar_members cm
     where cm.calendar_id = :calendar_id
  `;
};

const getAllCalendarsForUser = () => {
  return `
    select cm.* 
      from aic.calendar_members cm
     where cm.user_id = :user_id
  `;
};

module.exports = {
  getAllEventsCreatedByUser,
  getAllEventsForCalendar,
  getAllMembersOnCalendar,
  getAllCalendarsForUser,
};
