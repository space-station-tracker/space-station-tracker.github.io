
// Convert a UNIX timestamp to human readable format
// IN:
//  UNIX formatted timestamp e.g. 1549466923 (seconds since 1970 Jan 01)
let unixTimeToDateConverter = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp*1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
  return time;
}

// Extract data to view in Statistics Card of main window
// IN:
//  data: object from API get request
//  heading: self determined ISS heading angle
let updateStatistics = (data, heading) => {
  var origin = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
  var destination = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
  var altitude = Math.round(data['altitude']*100)/100;
  var velocity = Math.round(data['velocity']*100)/100;
  if (heading == "") {
    heading = "-.-";
  }

  $("#issLocationLong").text("Longitude:   " + destination[1] + "° E");
  $("#issLocationLat").text ("Latitude:    " + destination[0] + "° N");
  $("#issAltitude").text    ("Altitude:    " + altitude + " km");
  $("#issVelocity").text    ("Velocity:    " + velocity + " km/h");
  $("#issLocationTimestamp").text("Timestamp: " + unixTimeToDateConverter(data['timestamp']));
  $("#issHeading").text     ("Heading:     " + heading + "°");
}
