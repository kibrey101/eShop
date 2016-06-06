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

    /*$(document).on("click", ".homeSubmit", function (e) {
        e.preventDefault();

    });*/

    $(document).on("click", "#addToCart", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/addToCart",
            data: $("#productForm").serialize(),
            success: function () {
               $("#cartBadge").load(location.href + " #cartBadge>*","");
            }
        });
    });

    $(document).on("click", "#plus", function (e) {
        e.preventDefault();

       var quantity = parseInt($("#quantity").val());
        quantity += 1;
        $("#quantity").val(quantity);
        $("#total").val(quantity);
    });

    $(document).on("click", "#minus", function (e) {
        e.preventDefault();

        var quantity = parseInt($("#quantity").val());

        if(quantity > 1) {
            quantity -= 1;
            $("#quantity").val(quantity);
            $("#total").val(quantity);
        }

    });

    $("#total").keyup(function (e) {
        e.preventDefault();
        var quantity = parseInt($("#total").val());
        $("#quantity").val(quantity);
    });

    function stripeResponseHandler(status, response) {
        // Grab the form:
        var $form = $('#payment-form');

        if (response.error) { // Problem!

            // Show the errors on the form:
            $form.find('.payment-errors').text(response.error.message);
            $form.find('.submit').prop('disabled', false); // Re-enable submission

        } else { // Token was created!

            // Get the token ID:
            var token = response.id;

            // Insert the token ID into the form so it gets submitted to the server:
            $form.append($('<input type="hidden" name="stripeToken">').val(token));

            // Submit the form:
            $form.get(0).submit();
        }
    };

    var $form = $('#payment-form');
    $form.submit(function(event) {
        // Disable the submit button to prevent repeated clicks:
        $form.find('.submit').prop('disabled', true);

        // Request a token from Stripe:
        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from being submitted:
        return false;
    });
});