$(document).ready( function() {

  $( '#topheader .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
  $( '#topheader .navbar-nav' ).find( 'li.nav-item.hubble' ).addClass( 'active' );

  console.log("hubble says hello!");
}); // DOCUMENT ONLOAD
