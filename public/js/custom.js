$(function () {
    $("#search").keyup(function () {
        var search_term = $(this).val();

        $.ajax({
            method: "POST",
            url: "/api/search",
            data: {

            },
            dataType: "json",
            success: function (json) {
                var data = json.hits.hits.map(function (hit) {
                    return hit;
                });
                $("#searchResults").empty();
                for(var i = 0; i < data.length; i++){
                    var html = "";

                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $(document).on("click", ".plus", function (e) {

        alert("Hello! I am an alert box!!");
    });

});