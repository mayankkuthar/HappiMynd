import moment from "moment";

export function StringDateTimeCombine(giveneDate, time) {
  var returnDateTime = giveneDate + " " + time.toLowerCase();
  return returnDateTime;
}

export function StringToDateConvert(
  giveneDate,
  pattren = "YYYY-MM-DD hh:mm a"
) {
  var returnDateTime = moment(giveneDate, pattren);
  //console.log("returnDateTime", returnDateTime);
  return returnDateTime;
}

export function currentDateTime() {
  var currentTimeStr = moment().format("YYYY-MM-DD hh:mm a");
  var returnDateTime = moment(currentTimeStr, "YYYY-MM-DD hh:mm a");
  return returnDateTime;
}
