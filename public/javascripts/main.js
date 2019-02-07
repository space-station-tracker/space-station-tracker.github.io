$(document).ready( function() {
  // adjust header height
  $('#map').css("height", $(window).height()*0.5);
  // navigation bar move to respective page sections
  $(".navbar a").click( function() {
    $("body,html").animate({
     scrollTop:$("#" + $(this).data('value')).offset().top-60},300)
  });
  $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
    var origin = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
    var destination = [Math.round(data['latitude']*100)/100, Math.round(data['longitude']*100)/100];
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
      var cnt = 1;

      $("#issLocationButton").click(function() {
        map.flyTo({center: [destination[1],destination[0]], zoom: 3});
      });
      map.flyTo({center: [destination[1],destination[0]], zoom: 3});

      // Show ISS every 60 seconds
      setInterval( function() {

        $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
          let lat = Math.round(data['latitude']*100)/100;
          let long = Math.round(data['longitude']*100)/100;
          let altitude = Math.round(data['altitude']*100)/100;
          let velocity = Math.round(data['velocity']*100)/100;

          destination = [lat, long];

          let heading = Math.round(100*Math.atan2((destination[0]-origin[0]),(destination[1]-origin[1]))*180/Math.PI)/100;

          updateStatistics(data,heading);

          lineName = "route" + cnt;
          // must hve same sign, otherwise a long horizontal is drawn on the map
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

          origin = destination;
        }); // end GET ISS location
      }, 60000);// end set interval
    }); // onload map
  }); // initial get request

  // GET ASTRONAUT NAMES - NEED TO USE HTTPS API
  // $.getJSON('http://api.open-notify.org/astros.json', function(data) {
  //   let number = data['number'];
  //   console.log(number);
  //   $('#crewCount').text("Astronauts (" + number + ")");
  //
  //   var astronauts = data['people'];
  //   var cList = $('ul.astronaut-list');
  //
  //   $.each(astronauts, function(i) {
  //     var li_a = $('<li/>').appendTo(cList);
  //     var span = $('<span/>').addClass('test').text(astronauts[i]['name']).appendTo(li_a);
  //   })
  // });
  let cnt = 0;

  // LOAD DATA WHEN SCROLLED TO BOTTOM
  $(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
      // ajax call get data from server and append to the div
      // console.log("scrolled to bottom");
      console.log(cnt);
      $.getJSON('https://images-api.nasa.gov/search?q=space%20station%20cargo&year_start=2018&year_end=2019&media_type=image', (data) => {
        let info = data.collection.items[cnt];
        //let len = info.length;
        //let asd = [info[cnt+1],info[cnt+2],info[cnt+3]];
        cnt++;
        console.log(info.data);
        let title = info.data[0].title;
        let description = info.data[0].description;
        let date = info.data[0].date_created.substr(0,10);
        let copyright = "NASA";
        if (info.data[0].photographer) {
          copyright = info.data[0].photographer;
        }
        $.getJSON(info.href, (imagelinkdata) => {
          console.log(imagelinkdata);

          function insert(str, index, value) {
              return str.substr(0, index) + value + str.substr(index);
          }

          let link = insert(imagelinkdata[2],4,"s");
          console.log(link);
          let cont = `<div class="col-6">
                        <div class="card mb-3"><img class="card-img-top" src="` + link + `" alt="` + title + `" />
                          <div class="card-body">
                            <h5 class="card-title">` + title + `</h5>
                            <p class="card-text">` + description + `</p>
                            <p class="card-text"><small class="text-muted">` + date + ` © ` + copyright + `</small></p>
                          </div>
                        </div>
                      </div>`
          $(".nasa-images").append(cont);
        });
      });
    }
  });

}); // DOCUMENT ONLOAD
