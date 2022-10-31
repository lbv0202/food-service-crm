exports.install = function() {
    //user
    ROUTE('POST   /api/user/login',      			  ['*User/Login-->@exec']        );		
    ROUTE('GET    /api/user', 	   			  	      ['*User-->@get']	             );   
    ROUTE('POST   /api/user',  		 			      ['*User-->@save']	             );   
    ROUTE('GET    /api/user/grid',       			  ['*User-->@grid']              );   
    ROUTE('DELETE /api/user/{id}',      			  ['*User-->@remove']            ); 
    
    //product
    ROUTE('GET    /api/product',                      ['*Product-->@get']            );
    ROUTE('POST   /api/product',                      ['*Product-->@save']           );
    ROUTE('DELETE /api/product/{id}',                 ['*Product-->@remove']         );
    ROUTE('GET    /api/product/grid',                 ['*Product-->@grid']           );

    //product_category
    ROUTE('GET    /api/product_category',             ['*Product_category-->@get']   );
    ROUTE('POST   /api/product_category',             ['*Product_category-->@save']  );
    ROUTE('DELETE /api/product_category/{id}',        ['*Product_category-->@remove']);
    ROUTE('GET    /api/product_category/grid',        ['*Product_category-->@grid']  );
    
}