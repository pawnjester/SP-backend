const convertDateToString = () => {
  var date = new Date();
    const getFullYear = date.getFullYear();
    let getDate = date.getDate();
    let getMonth = (date.getMonth() + 1);

    if (getDate < 10)
      getDate = "0" + getDate;

    if (getMonth < 10)
      getMonth = "0" + getMonth;

      const cur_day = getFullYear + "-" + getMonth + "-" + getDate;

      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds();

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
}


export default convertDateToString;
