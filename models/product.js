var Pr = MODULE('Promise');

NEWSCHEMA('Product', function(schema) {
    schema.define('id',          'Number',           'c' );
    schema.define('category_id', 'Number',           'c' );
    schema.define('name',        'String(50)', true, 'cu');
    schema.define('price',       'Number',     true, 'cu');
    schema.define('dicount',     'Number',           'cu');
    schema.define('imgs',        'String(100)',      'cu');
    schema.define('summary',     'String(100)',      'cu');
    schema.define('description', 'String(500)',      'cu');
    schema.define('status',      'Number',           'cu');
    schema.define('created_at',  'Datetime',         'c' );
    schema.define('updated_at',  'Datetime',         'u' );

    schema.setResource('default');

    schema.setDefault(function(property) {
        if (property === 'status')      return 1;
        if (property === 'created_at')  return new Date();
        if (property === 'updated_at')  return new Date();
    });

    schema.setGet(function ($) {
        var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);									
		var sql = DB(); 
		sql.debug = true;
        sql.select('product', 'product').make(function(builder) {
            builder.fields('id',
                           'category_id',
                           'name',
                           'price',
                           'discount',
                           'imgs',
                           'summary',
                           'description',
                           'status',
                           'created_at',
                           'updates_at');
            if (o.id) builder.in('id', o.id);
            if (o.category_id) builder.in('category_id', o.category_id);
            if (o.name) builder.in('name', o.name);
            if (o.price) builder.in('price', o.price);
            if (o.discout) builder.in('discount', o.discount);
            if (o.imgs) builder.in('imgs', o.imgs);
                else if (typeof o.status == 'string') builder.in('status', (o.status == 'active') ? [1] : (o.status == 'all') ? [0,1] : [0]);                             	
                else if (isNum(o.status)) builder.where('status', o.status);                               
                else builder.where('status', 1); 
                    builder.first();		
        })
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Product/get', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product');
    });

    schema.setSave(function($) {
        var model = schema.clean($.model);
        var isINSERT = (model.id == 0) ? true : false;
        var act = isINSERT ? 'c' : 'u';
        var sql = DB();
        sql.debug = true;
        sql.save('product', 'product', isINSERT, function(builder, isINSERT) {
            builder.set(schema.filter('*' + act, model));
            if (isINSERT) {
                builder.where('id', model.id);
            }                
        })
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'product/save', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product');
    });

    schema.setRemove(function ($) {
        var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);									
		var sql = DB(); 
		sql.debug = true;

        if (!o.id) return $.success(false);

        sql.update('product', 'product').make(function(builder){
            builder.set('status', -1);
            builder.where('id', o.id);
        });

        sql.exec(function(err, resp){
            if (err) {
                LOGGER('error', 'prosuct/remove', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product');
    });

    schema.addWorkflow('grid', function ($){
        var q = $.query;
        q.page = q.page || 1;
        q.limit = q.limit || 5;
        var sql = DB();
        sql.debug = true;
        sql.listing('product', 'product').make(function(builder){
            builder.page(q.page, q.limit);
        });

        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'product/grid', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product');
    });
});
