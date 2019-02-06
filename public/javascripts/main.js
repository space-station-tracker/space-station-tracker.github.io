
$(document).ready( function() {

  // adjust header height
  $('#map').css("height", $(window).height()*0.5);

  // navigation bar move to respective page sections
  $(".navbar a").click( function() {
    $("body,html").animate({
     scrollTop:$("#" + $(this).data('value')).offset().top-60},300)
  });



  // get initial ISS position
  // https://api.wheretheiss.at/v1/satellites/25544 <-- ISS is satellite 25544
  // http://api.open-notify.org/iss-now.json
  $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {

    // USING http://api.open-notify.org/iss-now.json
    // var origin = [data['iss_position']['latitude'], data['iss_position']['longitude']];
    // var destination = [data['iss_position']['latitude'], data['iss_position']['longitude']];

    // USING https://api.wheretheiss.at/v1/satellites/25544
    var origin = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
    var destination = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
    // var altitude = Math.round(data['altitude']*100)/100;
    // var velocity = Math.round(data['velocity']*100)/100;

    // $("#issLocationLong").text("Longitude:   " + destination[1] + "° E");
    // $("#issLocationLat").text ("Latitude:    " + destination[0] + "° N");
    // $("#issAltitude").text    ("Altitude:    " + altitude + " km");
    // $("#issVelocity").text    ("Velocity:    " + velocity + " km/h");
    // $("#issLocationTimestamp").text("Timestamp: " + unixTimeToDateConverter(data['timestamp']));
    // $("#issHeading").text("Heading: -.- °");

    updateStatistics(data,"");

    // fetch map data from Mapbox and create Map instance
    mapboxgl.accessToken = 'pk.eyJ1IjoibHgtcHJvdG8iLCJhIjoiY2ptbjNyc2c1MG5wZzN2bng2bjFiNjY1eiJ9.ELlreuSL0JDbTCmrBa22cg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9', //'mapbox://styles/lx-proto/cjmn4el8pc0822sltahm3henp',
        zoom: 1,
        center: [origin[1], origin[0]]
    });

    map.on('load', function () {

      // console.log(destination[1]);
      // console.log(destination[0]);

      map.addLayer({
          "id": "route",
          "type": "line",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                      "type": "LineString",
                      "coordinates": [
                          [origin[1], origin[0]],
                          [destination[1], destination[0]],
                      ]
                  }
              }
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-color": "#00FFFF",
              "line-width": 3
          }
      });

      map.loadImage('images/iss-icon.png', function(error, image) {
        if (error) throw error;
        map.addImage('iss-icon', image);
        map.addLayer({
            "id": "iss-icon",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [destination[1], destination[0]]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "iss-icon",
                "icon-size": 0.2
            }
        });
      });

      // var lineArray = [[origin[1], origin[0]],
      // [destination[1], destination[0]]];

      // Source and Layer for Origin Point
      // map.addSource('pointOrigin', {
      //     "type": "geojson",
      //     "data": {
      //       "type": "Point",
      //       "coordinates": [destination[1],destination[0]]
      //     }
      // });
      // map.addLayer({
      //     "id": "pointOrigin",
      //     "source": "pointOrigin",
      //     "type": "symbol",
      //     "layout": {
      //       "icon-image": "airport-15",
      //       "icon-rotate": ["get", "bearing"],
      //       "icon-size": 1.5,
      //       "icon-rotation-alignment": "map",
      //       "icon-allow-overlap": true,
      //       "icon-ignore-placement": true
      //     }
      // });

      var cnt = 1;

      $("#issLocationButton").click(function() {
        map.flyTo({center: [destination[1],destination[0]], zoom: 3});
      });
      map.flyTo({center: [destination[1],destination[0]], zoom: 3});

      // Show ISS every 60 seconds
      setInterval( function() {

        // get newest location

        $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
          // USING http://api.open-notify.org/iss-now.json
          // let lat = data['iss_position']['latitude'];
          // let long = data['iss_position']['longitude'];
          // let timestamp = data['timestamp'];

          let lat = Math.round(data['latitude']*100)/100;
          let long = Math.round(data['longitude']*100)/100;
          let altitude = Math.round(data['altitude']*100)/100;
          let velocity = Math.round(data['velocity']*100)/100;

          destination = [lat, long];

          let heading = Math.round(100*Math.atan2((destination[0]-origin[0]),(destination[1]-origin[1]))*180/Math.PI)/100;
          // console.log(heading);

          // update on-screen values
          // $("#issLocationLong").text("Longitude:   " + destination[1] + "° E");
          // $("#issLocationLat").text ("Latitude:    " + destination[0] + "° N");
          // $("#issAltitude").text    ("Altitude:    " + altitude + " km");
          // $("#issVelocity").text    ("Velocity:    " + velocity + " km/h");
          // $("#issLocationTimestamp").text("Timestamp: " + unixTimeToDateConverter(data['timestamp']));
          // $("#issHeading").text     ("Heading:     " + heading + "°");

          updateStatistics(data,heading);
          // console.log("origin: " + origin[0] + "  " + origin[1]);
          console.log(destination[0] + ", " + destination[1]);
          // update destination point

          // var newVar = [[destination[1],destination[0]]];
          // lineArray = lineArray.concat(newVar);

          // console.log(lineArray);

          lineName = "route" + cnt;
          // only add layer if
          if (origin[1]*destination[1] > 0) {
            map.addLayer({
                "id": lineName,
                "type": "line",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "Feature",
                        "properties": {},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [origin[1], origin[0]],
                                [destination[1], destination[0]],
                            ]
                        }
                    }
                },
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#FF0000",
                    "line-width": 3
                }
            });
          }


          cnt++;

          map.getSource('iss-icon').setData({
            "type": "Point",
            "coordinates": [destination[1],destination[0]]
          });

          // map.getSource('route').setData({
          //   "type": "line",
          //   "source": {
          //       "type": "geojson",
          //       "data": {
          //           "type": "Feature",
          //           "properties": {},
          //           "geometry": {
          //               "type": "LineString",
          //               "coordinates": [lineArray]
          //           }
          //       }
          //   }
          // });

          // update origin point
          // map.getSource('pointOrigin').setData({
          //   "type": "Point",
          //   "coordinates": [origin[1],origin[0]]
          // });
          // update origin of next iteration

          origin = destination;
        }); // end GET ISS location
      }, 60000);// end set interval
    }); // onload map
  }); // initial get request

  // get astronaut names
  $.getJSON('http://api.open-notify.org/astros.json', function(data) {
    let number = data['number'];
    console.log(number);
    $('#crewCount').text("Astronauts (" + number + ")");

    var astronauts = data['people'];
    var cList = $('ul.astronaut-list');

    $.each(astronauts, function(i) {
      var li_a = $('<li/>').appendTo(cList);
      var span = $('<span/>').addClass('test').text(astronauts[i]['name']).appendTo(li_a);
    })


  });

  $('#spacer').css("height", ($(window).height()-$('#map').height()-$('#info').height()-$('#navbar').height() - $('#footer').height() - $('#textspacer').height()) );

}); // document ready

$(window).resize(function(){
    $('#map').css("height", $(window).height()*0.5);
    // Comma, not colon ----^
    $('.body').height($(window).height());
    $('.footer').css("bottom", 0);
    $('#spacer').css("height", ($(window).height()-$('#map').height()-$('#info').height()-$('#navbar').height()- $('#footer').height() - $('#textspacer').height()) );
});
