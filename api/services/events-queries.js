const getAllEventsForUserQuery = () => {
  return `
        select null as calendar_id, ce.* 
          from public.calendar_events ce
     left join public.calendar_event_assignments cea 
            on cea.event_id = ce.id
         where ce.user_id = :userId
           and cea.event_id is null
      union
        select cea.calendar_id, ce.*
          from public.calendar_events ce
          join public.calendar_event_assignments cea 
            on cea.event_id = ce.id 
          join public.calendar_members cm 
            on cm.calendar_id = cea.calendar_id 
         where cm.user_id = :userId
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

module.exports = {
  getAllEventsForUserQuery,
  getAllEventsForUserThisWeekQuery,
};
