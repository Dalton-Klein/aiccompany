import moment from 'moment';

const generateDateHeadings = (selectedDate) => {
  const dateArray = [];
  const startDay = moment(selectedDate, "YYYY/MM/DD");
  const mostRecentSunday = startDay.day(0);
  for (let i = 0; i <= 6; i++) {
    const dateData = mostRecentSunday.clone().add(i, 'days');
    dateArray.push({
      date: dateData.clone(),
      title: dateData.format('MMM D dddd'),
      events: [],
    }); // Format as "Mar 8 Friday"
  }
  return dateArray;
};

module.exports = {
  generateDateHeadings
}