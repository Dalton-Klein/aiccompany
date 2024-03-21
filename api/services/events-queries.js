const getAllEventsForUserQuery = () => {
  return `
        select null as calendar_id, ce.* 
          from public.calendar_events ce
     left join public.calendar_event_assignments cea 
            on cea.event_id = ce.id
         where ce.user_id = :userId
           and cea.event_id is null
           and ce.is_completed = false
      union
        select cea.calendar_id, ce.*
          from public.calendar_events ce
          join public.calendar_event_assignments cea 
            on cea.event_id = ce.id 
          join public.calendar_members cm 
            on cm.calendar_id = cea.calendar_id 
         where cm.user_id = :userId
           and ce.is_completed = false
      order by start_time asc;
  `;
};

const getAllEventsForUserThisWeekQuery = () => {
  return `
         select null as calendar_id, ce.* 
           from public.calendar_events ce
      left join public.calendar_event_assignments cea 
             on cea.event_id = ce.id
          where ce.user_id = :userId
            and cea.event_id is null
            and DATE_PART('week', ce.start_time) = DATE_PART('week', CURRENT_DATE)
      union
         select cea.calendar_id, ce.*
           from public.calendar_events ce
           join public.calendar_event_assignments cea 
             on cea.event_id = ce.id 
           join public.calendar_members cm 
             on cm.calendar_id = cea.calendar_id 
          where cm.user_id = :userId
            and DATE_PART('week', ce.start_time) = DATE_PART('week', CURRENT_DATE)
       order by start_time asc;
  `;
};

const getEventQuery = () => {
  return `
         select ce.* 
           from public.calendar_events ce
          where ce.id = :eventId
  `;
};

const getEventAssignmentsRelevantToUserQuery = () => {
  return `
           select cm.calendar_id, c.title,
                      (select 1 
                         from public.calendar_event_assignments cea 
                        where cea.calendar_id = cm.calendar_id
                          and cea.event_id = :eventId) as is_assigned,
                      (select count(*)
                         from public.calendar_members cm2
                        where cm2.calendar_id = c.id) as member_count
             from public.calendar_members cm 
             join public.calendars c
               on c.id = cm.calendar_id
            where user_id = :userId
  `;
};

module.exports = {
  getAllEventsForUserQuery,
  getAllEventsForUserThisWeekQuery,
  getEventQuery,
  getEventAssignmentsRelevantToUserQuery,
};
