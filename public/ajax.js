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
});