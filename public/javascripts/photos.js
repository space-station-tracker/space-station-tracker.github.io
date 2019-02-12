$(document).ready( function() {

  $( '#topheader .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
  $( '#topheader .navbar-nav' ).find( 'li.nav-item.photos' ).addClass( 'active' );

  // console.log("photos says hello!");

  // $('.parallax-window').parallax({imageSrc: '/images/136149_iss-space-shuttle-nasa-station-endeavour_6048x4032_h.jpg'});

  let cnt = 0;
  // LOAD DATA WHEN SCROLLED TO BOTTOM
  $(window).scroll( () => {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
      // $(' #loadmore').click( () => {
      // console.log('Load More Clicked ;-)');
      // ajax call get data from server and append to the div
      // console.log("scrolled to bottom");
      // console.log(cnt);
      for (i = 0; i < 6; i++) {
        $.getJSON('https://images-api.nasa.gov/search?q=ISS&year_start=2018&year_end=2019&media_type=image', (data) => {
          let info = data.collection.items[cnt];
          //let len = info.length;
          //let asd = [info[cnt+1],info[cnt+2],info[cnt+3]];
          cnt++;
          // console.log(info.data);
          let title = info.data[0].title;
          let description = info.data[0].description;
          let date = info.data[0].date_created.substr(0,10);
          let copyright = "NASA";
          if (info.data[0].photographer) {
            copyright = info.data[0].photographer;
          }
          $.getJSON(info.href, (imagelinkdata) => {
            // console.log(imagelinkdata);

            function insert(str, index, value) {
                return str.substr(0, index) + value + str.substr(index);
            }

            description = "";

            let link = insert(imagelinkdata[2],4,"s");
            // console.log(link);
            let cont = `<div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                          <div class="card mb-3"><img class="card-img-top" src="` + link + `" alt="` + title + `" />

                          </div>
                        </div>`;

                        // <div class="card-body">
                        //   <h5 class="card-title">` + title + `</h5>
                        //   <p class="card-text">` + description + `</p>
                        //   <p class="card-text"><small class="text-muted">` + date + ` © ` + copyright + `</small></p>
                        // </div>

            $(".nasa-images").append(cont);
          });
        });
      } // for loop 6 times
    } // if scroll triggered
  });

}); // DOCUMENT ONLOAD
