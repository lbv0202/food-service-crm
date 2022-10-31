var Pr = MODULE('Promise');

NEWSCHEMA('Product_category', function(schema) {
    schema.define('id',          'Number',                'c' );
    schema.define('up',          'Number',                'c' );
    schema.define('emoji',       'String(5)',             'cu');
    schema.define('name',        'String(50)',    true,   'cu');
    schema.define('description', 'String(100)',           'cu');
    schema.define('thumb',       'String(100)',           'cu');
    schema.define('ord',         'Number',                'cu');
    schema.define('created_at',  'Datetime',              'c' );
    schema.define('updated_at',  'Datetime',              'u' );

    schema.setResource('default');

    schema.setDefault(function(property) {
        if (property === 'created_at') return new Date();
        if (property === 'updated_at') return new Date();
    });

    schema.setGet(function ($){
        var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);
        var sql = DB();
        sql.debug = true;
        sql.select('product_category', 'product_category').make(function(builder) {
            builder.fields('id',
                           'up',
                           'emoji',
                           'name',
                           'description',
                           'thumb',
                           'ord',
                           'created_at',
                           'updated_at');
            if (o.id) builder.in('id', o.id);
            if (o.up) builder.in('up', o.up);
            if (o.emoji) builder.in ('emoji', o.emoji);
            if (o.name) builder.in('name', o.name);
            if (o.thumb) builder.in('thumb', o. thumb);
            if (o.ord) builder.in('ord', o.ord);
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Product_category/get', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product_category');
    });

    schema.setSave(function ($) {
        var model = schema.clean($.model);
        var isINSERT = (model.id == 0) ? true : false;
        var act = isINSERT ? 'c' : 'u';
        var sql = DB();
        sql.debug = true;
        sql.save('product_category', 'product_category', isINSERT, function(builder, isINSERT) {
            builder.set(schema.filter('*' + act, model));
            if (isINSERT) {
                builder.where('id', model.id);
            }
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'product_category/save', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'product_category');
    });

    schema.setRemove(function ($) {
        var o = Object.assign({}, U.isEmpty($.params) ? $.options : $.params);
        var sql = DB();
        sql.debug = true;

        if (!o.id) return $success(false);

        sql.update('product_category', 'product_category').make(function(builder) {
            builder.where('id', o.id);
        });

        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Product_category/remove', err);
                return $.success(false);
            }
            if (!resp) $.success(false, 'Product_category not found');
            return $.success(true);
        }, 'product_category');
    });

    schema.addWorkflow('grid', function ($) {
        var q = $.query;
        q.page = q.page || 1;
        q.limit = q.limit || 2;
        var sql = DB();
        sql.debug = true;
        sql.listing('product_category', 'product_category').make(function(builder) {
            builder.page(q.page, q.limit);
        });

        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'product_category/grid', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'produt_category');
    });
});