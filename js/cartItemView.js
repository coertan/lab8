/*
    createCartItemView()

    Creates a view for a single cart item. This exists
    so that we can attach the item to the remove button
    so that when it's clicked, we know what item to remove.
*/

function createCartItemView(config) {	

	var view = createTemplateView(config);

	view.afterRender = function(clonedTemplate, model){
		clonedTemplate.find('.remove-item').click(function(){
			view.cartModel.removeItem(model);
		});
	}//afterRender

	return view;

} //createCartItemView()
