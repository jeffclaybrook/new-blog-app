const months = [
 "Jan",
 "Feb",
 "Mar",
 "Apr",
 "May",
 "Jun",
 "Jul",
 "Aug",
 "Sep",
 "Oct",
 "Nov",
 "Dec"
]

const days = [
 "Sunday",
 "Monday",
 "Tuesday",
 "Wednesday",
 "Thursday",
 "Friday",
 "Saturday"
]

export const getFullDay = timestamp => {
 const date = new Date(timestamp)
 return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getDay = timestamp => {
 const date = new Date(timestamp)
 return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getDayName = timestamp => {
 const date = new Date(timestamp)
 return days[date.getDay()]
}