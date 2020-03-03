$(document).ready(function(){
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