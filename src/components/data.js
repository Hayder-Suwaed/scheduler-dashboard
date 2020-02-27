import {
    getTotalInterviews,
    getLeastPopularTimeSlot,
    getMostPopularDay,
    getInterviewsPerDay
  } from "helpers/selectors";
  
  const data = [
    {
      id: 1,
      label: "Total Interviews",
      getValue: getTotalInterviews
    },
    {
      id: 2,
      label: "Least Popular Time Slot",
      getValue: getLeastPopularTimeSlot
    },
    {
      id: 3,
      label: "Most Popular Day",
      getValue: getMostPopularDay
    },
    {
      id: 4,
      label: "Interviews Per Day",
      getValue: getInterviewsPerDay
    }
  ];
  
  export default data;