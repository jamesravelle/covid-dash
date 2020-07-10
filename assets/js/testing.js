$( document ).ready(function() {
    function getTesting(){
        var state = $('#location option:selected').text();
        var query = "https://covid-19-testing.github.io/locations/" + state + "/complete.json";
        $.ajax({
            url:query,
            method:"GET",
            error:function (xhr, ajaxOptions, thrownError){
              if(xhr.status==404) {
                  // $('#show-testing').css("display" , "none");
                  return;
        }
    }
        }).then(function(response){
            console.log(response);
            // $('#show-testing').css("display" , "block");
            for(var i = 0; i < response.length; i++){
                var newDiv = $('<div>');
                newDiv.append(response[i].name)
                newDiv.append(response[i].phones[0].number)
                newDiv.append(response[i].physical_address[0].address_1)
                newDiv.append(response[i].physical_address[0].city)
                newDiv.append(response[i].physical_address[0].state_province)
                newDiv.append(response[i].physical_address[0].postal_code)
                $('#testing-modal-body').append(newDiv);
            }
        })
}

$('#show-testing').on("click", function(e){
    e.preventDefault();
    $('.testing-modal').addClass('is-active');
})

})
