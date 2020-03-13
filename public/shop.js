$(document).ready(function(){

  //shop products
  $.getJSON('/shared/object-data-shop',(product)=>{
    $.each(product,(key,entry)=>{
      var div = $('div.'+entry._id);
      var productid = div.data("productid");
      var artistid = div.data("artistid");
      var artistsong = div.data("artistsong");
      $('span.'+productid).text("$ "+entry.product_price);
      $('span.name'+productid).text("Name: "+entry.product_name);
      $('p.'+productid).text(entry.product_description);
      if(artistsong != "undefined"){
      $.getJSON('/shared/object-data?id='+artistsong+'&data_type=song',(song)=>{
        $('span.product-song'+productid).text("Song: "+song.song_title);
      });
      }
    });
   });

  //counter
  $.getJSON('/shared/auctions',(data)=>{
    $.each(data, (key,entry)=>{
      var span = $("span."+entry._id);
      var startDate = new Date(span.data("startdate")).getTime();
      var endDate = new Date(span.data("enddate")).getTime();
      // Update the count down every 1 second
      var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
          
        // Find the distance between now and the count down date
        var timeLeft = endDate - now;
        ///check when bidding will be opened
        var auctionOpen = startDate - now;
        if(auctionOpen > 0){
          clearInterval(x);
          var ONE_HOUR = Math.floor((auctionOpen % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if(auctionOpen < ONE_HOUR){
            console.log("Hello");
            span.text("Biding Start in one Hour").addClass("auction-bid");
          }
          span.text("Bidding Start:" +span.data("startdate").split("GMT+0200")[0]).addClass("auction-bid");
        }else{
          // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
              
            // Output the result in an element with id="demo"
            span.text(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ").addClass("auction-bid");
              
            // If the count down is over, write some text 
            if (timeLeft < 0) {
              clearInterval(x);
              span.text("EXPIRED");
            }
        }
      }, 1000);
    });
  });
  //counter end
    $(".panel-heading").parent('.panel').hover(
        function() {
            var div=$(this).closest("div.products");
            var id= div.data("id").slice(0,24);
            $.getJSON('/shared/object-data?id='+id+'&data_type=product',(data)=>{
                console.log(data);
            });
          $(this).children('.collapse').collapse('show');
        }, function() {
          $(this).children('.collapse').collapse('hide');
        }
      );
      console.log("hhh twaban");

});

function addTocart(product_id){
    console.log(product_id.slice(0,24));
    $.getJSON('/shop/add-to-cart/?product_id='+product_id.slice(0,24), (product)=>{
        console.log(product);
        if(product.totalQty == 0){
          $('span.cart-quantity').text(product.totalQty);
        }else{
          $('span.cart-quantity').text(product.totalQty);
        }
        
    });
}

function bid(auction_id){
  console.log(auction_id);
  var modal = $('div#auctionValue');
  modal.find('.auction_id').val(auction_id);
}