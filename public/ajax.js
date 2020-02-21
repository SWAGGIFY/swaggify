$(document).ready(function(){
    console.log("Running");
    ///delete teachers
    $("a.delete").click(function(e){
        e.preventDefault();
        console.log("function clicked");
        var tr = $(this).closest("tr");
        var modal = $("#deleteDetailModal");
        var id =tr.data("id").slice(0,24);
        var data_type = tr.data("type");
        console.log(id +" "+ data_type);
        $.getJSON('/shared/object-data?id=' + id + '&data_type=' + data_type, function (data) {
          console.log(data)
          if(data_type =="user"){
            modal.find(".object").text('DELETE ' + data.firstname + " "+ data.lastname);//.attr("action" "/admin/admin-student-list-data/" );
          }else if(data_type =="request"){
            modal.find(".object").text('DELETE ' + data.request);//.attr("action" "/admin/admin-student-list-data/" );
          }else if(data_type =="category"){
            modal.find(".object").text('DELETE ' + data.category_name);//.attr("action" "/admin/admin-student-list-data/" );
          }else{
            modal.find(".object").text('DELETE ' + data.product_name);//.attr("action" "/admin/admin-student-list-data/" );
          }
          document.getElementById("clickconfirm").addEventListener("click", clickconfirm);
        
            function clickconfirm(){
                console.log("Confirm clicked")
              $.getJSON('/shared/delete-data?id=' + id + '&data_type=' +data_type, (data)=>{
                console.log(data);
                alert(data);
                location.reload(true);
              });
            }
        });
    });
      ///Select options for classes
  let category = $('#category');
  let song = $('#song');
  let artist = $('#artist');
  let products = $('#products');
  category.empty();
  song.empty();
  artist.empty();
  products.empty();

  //
category.append('<option disabled selected>Choose Category</option>');
song.append('<option disabled selected>Choose Song</option>');
artist.append('<option disabled selected>Choose Artist</option>');
products.append('<option disabled selected>Choose Product</option>');
//subjects.prop('selectedIndex', 0);

// Populate dropdown with list of subjects
$.getJSON('/shared/category-data', (data)=>{
    $.each(data, function (key, entry) {
      category.append($('<option></option>').attr('value', entry.category_name,'title',entry.category_description).text( entry.category_name));

    });
});

$.getJSON('/shared/artist-data', (data)=>{
  $.each(data, function (key, entry) {
    song.append($('<option></option>').attr('value', entry.category_name,'title',entry.category_description).text( entry.category_name));
  });
});

$.getJSON('/shared/product-data', (data)=>{
  $.each(data, function (key, entry) {
    products.append($('<option></option>').attr('value', entry.product_name,'title',entry.category_description).text( entry.category_name));

  });
});

});