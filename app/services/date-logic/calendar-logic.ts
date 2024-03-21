import moment from "moment";

export function generateDateHeadings(selectedDate: any) {
  const dateArray = [];
  const startDay = moment(selectedDate, "YYYY/MM/DD");
  const mostRecentSunday = startDay.day(0);
  for (let i = 0; i <= 6; i++) {
    const dateData = mostRecentSunday.clone().add(i, "days");
    dateArray.push({
      date: dateData.clone(),
      title: dateData.format("MMM D dddd"),
      events: [],
    }); // Format as "Mar 8 Friday"
  }
  return dateArray;
}

export function findOpenTimeSlots(events: any) {
  const openSlots = [];

  // Get the current time
  const currentTime = moment();

  // Initialize the start time of the current slot
  let currentSlotStart = currentTime;

  // Iterate through each event
  for (const event of events) {
    const eventStart = moment(event.start_time);
    const eventEnd = moment(event.end_time);

    // If the event starts after the current time, check for open slots
    if (eventStart.isAfter(currentTime)) {
      // If there's a gap between the current slot end and the event start, it's an open slot
      if (currentSlotStart.isBefore(eventStart)) {
        const slotDuration = moment.duration(eventStart.diff(currentSlotStart));
        // If the slot duration is at least 30 minutes, add it to the openSlots array
        if (slotDuration.asMinutes() >= 30) {
          openSlots.push({
            break_start: currentSlotStart.toISOString(),
            break_end: eventStart.toISOString(),
          });
        }
      }
    }

    // Update the currentSlotStart to the end time of the event
    currentSlotStart = eventEnd;
  }

  // Check if there's an open slot at the end of the day
  const endOfDay = moment().endOf("day");
  if (currentSlotStart.isBefore(endOfDay)) {
    const slotDuration = moment.duration(endOfDay.diff(currentSlotStart));
    if (slotDuration.asMinutes() >= 30) {
      openSlots.push({
        break_start: currentSlotStart.toISOString(),
        break_end: endOfDay.toISOString(),
      });
    }
  }

  return openSlots;
}
