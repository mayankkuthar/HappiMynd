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

const growthPlanNames = [
  "SELF STARTER",
  "BUDDY",
  "BUDDY PLUS",
  "CARE 3X",
  "CARE 6X",
  "CARE 12X",
];

export function isGrowthPlan(sub) {
  if (!sub) return false;
  const raw = String(sub.name || "")
    .toUpperCase()
    .replace(/^HAPPI\s*/i, "")
    .trim();
  return growthPlanNames.includes(raw);
}

export function hasHappiLIFEAccess(sub) {
  if (!sub) return false;
  const name = String(sub.name || "");
  if (name.includes("HappiLIFE")) return true;
  return isGrowthPlan(sub);
}

export function hasHappiLEARNAccess(sub) {
  if (!sub) return false;
  const name = String(sub.name || "");
  if (name.includes("HappiLEARN") || name.includes("HappiLIFE Summary Reading"))
    return true;
  return isGrowthPlan(sub);
}

const happiBuddyPlanNames = [
  "BUDDY",
  "BUDDY PLUS",
  "CARE 3X",
  "CARE 6X",
  "CARE 12X",
];

export function hasHappiBUDDYAccess(sub) {
  if (!sub) return false;
  const upper = String(sub.name || "").toUpperCase();
  if (upper.includes("BUDDY")) return true;
  const raw = upper.replace(/^HAPPI\s*/, "").trim();
  return happiBuddyPlanNames.includes(raw);
}

export function hasHappiSELFAccess(sub) {
  if (!sub) return false;
  const name = String(sub.name || "");
  if (name.includes("HappiSELF")) return true;
  return isGrowthPlan(sub);
}
