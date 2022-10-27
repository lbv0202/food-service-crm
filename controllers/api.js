exports.install = function() {
    //user
    ROUTE('POST   /api/user/login',      			  ['*User/Login-->@exec'] );		
    ROUTE('GET    /api/user', 	   			  	      ['*User-->@get']	      );   
    ROUTE('POST   /api/user',  		 			      ['*User-->@save']	      );   
    ROUTE('GET    /api/user/grid',       			  ['*User-->@grid']       );   
    ROUTE('DELETE /api/user/{id}',      			  ['*User-->@remove']     ); 
    
    //product
    ROUTE('GET    /api/product',                      ['*Product-->@get']     );
    ROUTE('POST   /api/product',                      ['*Product-->@save']    );
    ROUTE('DELETE /api/product{id}',                  ['*Product-->@remove']  );
    ROUTE('GET    /api/product/grid',                 ['*Product-->@grid']    );
    
}