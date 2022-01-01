export const timeZones = [
  ["-11", "(UTC-11:00) American Samoa"],
  ["-10", "(UTC-10:00) Hawaii"],
  ["-9", "(UTC-09:00) Alaska"],
  ["-8", "(UTC-08:00) Pacific Time (US and Canada)"],
  ["-7", "(UTC-07:00) Mountain Time (US and Canada)"],
  ["-6", "(UTC-11:00) Central Time (US and Canada)"],
  ["-5", "(UTC-05:00) Eastern Time (US and Canada)"],
  ["-4", "(UTC-04:00) Atantic Time (Canada)"],
  ["-3", "(UTC-03:00) City of Buenos Aires"],
  ["-2", "(UTC-02:00) Fernando de Noronha"],
  ["-1", "(UTC-01:00) Cabo Verde Islands"],
  ["0", "(UTC) Dublin, Edinburgh, Lisbon, London"],
  ["1", "(UTC+01:00) Berlin, Madrid, Paris, Warsaw"],
  ["2", "(UTC+02:00) Athens, Bucharest, Cairo, Jerusalem"],
  ["3", "(UTC+03:00) Baghdad, Istanbul, Moscow"],
  ["4", "(UTC+04:00) Abu Dhabi, Tbilisi, Yerevan"],
  ["5", "(UTC+05:00) Ekaterinburg, Islamabad, Karachi"],
  ["6", "(UTC+06:00) Astana, Dhaka"],
  ["7", "(UTC+07:00) Bangkok, Hanoi, Jakarta, Tomsk"],
  ["8", "(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei"],
  ["9", "(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul"],
  ["10", "(UTC+10:00) Brisbane, Melbourne, Sydney, Guam"],
  ["11", "(UTC+11:00) Norfolk Island, Solomon Islands"],
  ["12", "(UTC+12:00) Auckland, Wellington, Fiji Islands"],
  ["13", "(UTC+13:00) Nuku'alofa, Samoa"],
  ["14", "(UTC+14:00) Kiritimati Island"]
];

export const updateUser = (formData) => {
  return $.ajax({
    method: "PATCH",
    url: `/api/users/${formData.get("id")}`,
    data: formData,
    contentType: false,
    processData: false
  });
}