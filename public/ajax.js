$(document).ready(function(){
     ///Select options for classes
     let category = $('#category');
     var song = $('#songs');
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
    $.getJSON('/shared/artist-data', (data)=>{
      $.each(data, function (key, entry) {
        artist.append($('<option></option>').attr('value', entry._id).text( entry.firstname+" "+entry.lastname));
        //artist.attr('onchange','data("'+entry._id+'")');
      });
    });

    $("select.artist").change((e)=>{
      e.preventDefault();
      song.empty();
      //$('#songs').load(location.href + " #songs")
      //$("#songs").html(select);
      var id=$("#artist").attr("selected", "true").val();
      console.log( id);
      $.getJSON('/shared/artist-songs?id='+id, (data)=>{
        console.log(data);
        $.each(data, function (key, entry) {
          song.append($('<option></option>').attr('value', entry._id).text( entry.song_title+" "+entry.date_released));
          song.trigger("chosen:updated");
          //artist.attr('onchange','data("'+entry._id+'")');
        });
      });
    });

    ///delete handler
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
          }else if(data_type =="song"){
            modal.find(".object").text('DELETE ' + data.song_title);//.attr("action" "/admin/admin-student-list-data/" );
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

  // Populate dropdown with list of subjects
  $.getJSON('/shared/category-data', (data)=>{
      $.each(data, function (key, entry) {
        category.append($('<option></option>').attr('value', entry.category_name,'title',entry.category_description).text( entry.category_name));

      });
  });
  $.getJSON('/shared/product-data', (data)=>{
    $.each(data, function (key, entry) {
      
      products.append($('<option></option>').attr('value', entry.product_name,'title',entry.category_description).text( entry.product_name));

    });
  });

  $('select.artist').click(function(){
    console.log("hello waiting");
  });

});

function mySearch(){
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }

}
