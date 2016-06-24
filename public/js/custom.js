$(function () {
    $(".shippingForm").hide();
    $('select').material_select();
     function cartSum() {
        var total = 0;
        $(".cartQuantity").each(function () {
            total += parseInt($(this).val());
        });
        $(".cartSummary").html(total);
    }
    cartSum();
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
    $(document).on("click", "#profileRadio", function () {
        $(".shippingForm").hide("slow");
        $("#proSendOrderButton").show("slow");
    });
    $(document).on("click", "#anotherRadio", function () {
        $(".shippingForm").show("slow");
        $("#proSendOrderButton").hide("slow");
    });
    $(document).on("click", ".homeAddToCart", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/addToCart",
            data: $(this).closest("form").serialize(),
            success: function () {
                $("#cartBadge").load(location.href + " #cartBadge>*","");
            }
        });
    });
    
    $(document).on("click", ".plusBtn", function (e) {
        e.preventDefault();
       var quantity = parseInt($(this).siblings(".quantity").val());
        quantity += 1;
        $(this).siblings(".quantity").val(quantity);
        $(this).siblings(".cartQuantity").val(quantity);
        cartSum();
        $.ajax({
            method: "POST",
            url: "/updateCart",
            data: $(this).closest("form").serialize(),
            success: function () {
                $("#cartBadge").load(location.href + " #cartBadge>*","");
            }
        });
    });

    $(document).on("click", ".productPlusBtn", function (e) {
        e.preventDefault();

        var quantity = parseInt($(this).siblings(".quantity").val());
        quantity += 1;
        $(this).siblings(".quantity").val(quantity);
        $(this).siblings(".productQuantity").val(quantity);
    });

    $(document).on("click", ".minusBtn", function (e) {
        e.preventDefault();
        var quantity = parseInt($(this).siblings(".quantity").val());
        if(quantity > 1) {
            quantity -= 1;
            $(this).siblings(".quantity").val(quantity);
            $(this).siblings(".cartQuantity").val(quantity);
            cartSum();
            $.ajax({
                method: "POST",
                url: "/updateCart",
                data: $(this).closest("form").serialize(),
                success: function () {
                    $("#cartBadge").load(location.href + " #cartBadge>*","");
                }
            });
        }

    });

    $(document).on("click", ".productMinusBtn", function (e) {
        e.preventDefault();
        var quantity = parseInt($(this).siblings(".quantity").val());

        if(quantity > 1) {
            quantity -= 1;
            $(this).siblings(".quantity").val(quantity);
            $(this).siblings(".productQuantity").val(quantity);
        }

    });

    $(".homeCartQuantity").keyup(function (e) {
        e.preventDefault();
        var quantity = parseInt($(this).val());
        $(this).prev(".quantity").val(quantity);
    });

    $(".productQuantity").keyup(function (e) {
        e.preventDefault();
        var quantity = parseInt($(this).val());
        $(this).prev(".quantity").val(quantity);
    });

    $(".cartQuantity").keyup(function (e) {
        e.preventDefault();
        cartSum();
        var quantity = parseInt($(this).val());
        $(this).prev(".quantity").val(quantity);
        $.ajax({
            method: "POST",
            url: "/updateCart",
            data: $(this).closest("form").serialize(),
            success: function () {
                $("#cartBadge").load(location.href + " #cartBadge>*","");
            }
        });
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