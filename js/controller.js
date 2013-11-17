/* controller.js
    Controller for Shopping Cart page
*/

$(function(){

	var formatLabels = {
	    dvd: 'DVD',
	    bluray: 'Blu-Ray'
	};

	//create the model for the cart
	var cartModel = createCartModel();

	//create the view for the cart
	var cartView = createCartView({
	    model: cartModel,
	    template: $('.cart-item-template'),
	    container: $('.cart-items-container'),
	    totalPrice: $('.total-price')
	});

	//create the model for the movies
	var moviesModel = createMoviesModel({
    	url: 'https://courses.washington.edu/info343/ajax/movies/'
	});

	//this code will save the cart, so if the user leaves the page
	//and returns their cart will persist
	var cartJSON = localStorage.getItem('cart');
	if (cartJSON && cartJSON.length > 0) {
    	cartModel.setItems(JSON.parse(cartJSON));
	}

	//create the view for the movies
	var moviesView = createMoviesView({
	    model: moviesModel,
	    template: $('.movie-template'),
	    container: $('.movies-container')
	});

	//refresh to get movies from server
	moviesModel.refresh();

	//when the movies view triggers 'addToCart'
	//add a new item to the cart, using the supplied
	//movieID and format
	moviesView.on('addToCart', function(data){
	    var movie = moviesModel.getItem(data.movieID);
	    if (!movie)
	        throw 'Invalid movie ID "' + movieID + '"!'; 

	    cartModel.addItem({
	        id: movie.id,
	        title: movie.title,
	        format: data.format,
	        formatLabel: formatLabels[data.format],
	        price: movie.prices[data.format]
	    });
	}); //addToCart event



	//code to run when the place order button is clicked
	//we use ajax to submit the cart to an external url
	$('.place-order').click(function(){
		
		$.ajax({
		    url: 'https://courses.washington.edu/info343/ajax/movies/orders/',
		    type: 'POST',
		    data: cartModel.toJSON(),
		    contentType: 'application/json',
		    success: function(responseData) {
		        //code to run after successful post
		        alert(responseData.message);	
		        //clear the cart after a successful submission
		        cartModel.setItems([]);

		    },
		    error: function(jqXHR, status, errorThrown) {
		        //error with post--alert user
		        alert(errorThrown || status);
		    }
		}); //ajax()
	});//place-order click function

	
	cartModel.on('change', function(){
    	localStorage.setItem('cart', cartModel.toJSON());
	});

}); //doc ready()


