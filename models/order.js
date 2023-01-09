var Pr = MODULE('Promise');

NEWSCHEMA('Order', function(schema) {
    schema.define('id',         'Number',           'c' );
    schema.define('user_id',    'Number',           'c' );
    schema.define('status',     'Number',           'cu');
    schema.define('cost',       'Number',           'cu');
    schema.define('comment',    'String',           'cu');
    schema.define('type_pay',   'String',           'c' );
    schema.define('status_pay', 'Number',           'cu');
    schema.define('created_at', 'Datetime',         'c' );
    schema.define('updated_at', 'Datetime',         'cu');

    schema.setResource('default');

    schema.setGet(function (property) {
        if (property === 'status')      return 1;
        if (property === 'created_at')  return new Date();
        if (property === 'updated_at')  return new Date();
    });

    schema.setGet(function($) {
        var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);
        var sql = DB();
        sql.debug = true;
        sql.select('order', 'order').make(function(builder) {
            builder.fields('id',
                            'user_id',
                            'status',
                            'cost',
                            'comment',
                            'type_pay',
                            'status_pay',
                            'created_at',
                            'updated_at');
            if (o.id) builder.in('id', o.id);
            if (o.user_id) builder.in('user_id', o.user_id);
            if (o.comment) builder.in('comment', o.comment);
            if (o.type_pay) builder.in('type_pay', o.type_pay);
            if (o.status_pay) builder.in('status_pay', o.status_pay);
            else if (typeof o.status == 'string') builder.in('status', (o.status == 'active') ? [1] : (o.status == 'all') ? [0,1] : [0]);
            else if (isNum(o.status)) builder.where('status', o.status);
            else builder.where('status', 1);
            builder.first();
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Order/get', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $success (true, resp);
        }, 'order');
    });

    schema.setSave(function($) {
        var model = schema.clean($.model);
        var isINSERT = (model.id == 0) ? true: false;
        var act = isINSERT ? 'c' : 'u';
        var sql = DB();
        sql.debug = true;
        sql.save('order', 'order', isINSERT, function(builder, isINSERT) {
            builder.set(schema.filter('*' + act, model));
            if (isINSERT) {
                builder.where('id', model.id);
            }
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'order/save', err);
                return $.success(false);
            }
            if (!resp) $.success(false);
            return $.success(true, resp);
        }, 'order');
    });

    schema.setRemove(function($) {
        var o = Object.assign({}, U.isEmpty($.params) ? $.options : $.params);
        var sql = DB();
        sql.debug = true;

        if (!o.id) return $.success(false);

        sql.update('order', 'order').make(function(builder) {
            builder.set('status', -1);
            builder.where('id', o.id);
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Order/remove', err);
                return $.success(false);
            }
            if (!resp) $.success(false, 'Order not found');
            return $.success(true);
        }, 'order');
    });

    schema.addWorkflow('grid', function($) {
        var q = $.query;
        q.page = q.page || 1;
        q.limit = q.limit || 15;
        var sql = DB();
        sql.debug = true;
        sql.listing('order', 'order').make(function(builder) {
            builder.page(q.page, q.limit);
        });

        if (q.search) {
            builder.scope(function() {
                builder.like('id', q.search, '*');
            });
        }
        builder.where('status', '>', '-1');
        builder.page(q.page, q.limit);
        
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'order/grid', err);
                return $.callback([]);
            }
            return $callback({'total': resp,count, 'rows': resp.items});
        }, 'order');
    });    
});

NEWSCHEMA('Order/Product', function(schema) {
    schema.define('id',         'Number',           'c');
    schema.define('product_id', 'Number',           'c');
    schema.define('cnt',        'Number',           'c');
    schema.define('created_at', 'Datetime',         'c');

    schema.setResource('default');

    schema.setDefault(function(property) {
        if (property === 'created_at') return new Date();
    });

    schema.setGet(function($) {
        var o = Object.assign({}, U.isEmpty($.query) ? $.opitions : $.query);
        var sql = DB();
        sql.debug = true;
        sql.select('order_x_product', 'order_x_product').make(function(builder) {
            builder.fields('id',
                            'product_id',
                            'cnt',
                            'created_at');
            if (o.id) builder.in('id', o.id);
            if (o.product_id) builder.in('product_id', o.product_id);
            if (o.cnt) builder.in('cnt', o.cnt);
            builder.first();
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Order/Product/get', err);
                return $.success(false);
            }
            if (!resp) $.sucess(false);
            return $.success(true, resp);
        }, 'order_x_product');
    });

    schema.setSave(function($) {
        var model = schema.clean($.model);
        var sql = DB();
        sql.debug = true;
        sql.save('order_x_product', "order_x_product", function(builder) {
            builder.set(schema.filter('*' + 'c', model));
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Order/Product/save', err);
                return $.success(false);
            }
            if(!resp) $.success(false);
            return $.success(true, resp);
        }, 'order_x_product');
    });

    schema.setQuery(function($) {
        var o = Object.assign({}, U.isEmpty($.query) ? $.options : $.query);
        if (U.isEmpty(o)) o = {};
        var sql = DB();
        sql.debug = true;
        sql.select('order_x_product', 'order_x_product').make(function(builder) {
            if (o.id) builder.in('id', o.id);
        });
        sql.exec(function(err, resp) {
            if (err) {
                LOGGER('error', 'Order/Product/query', err);
                return $.success(false);
            }
            return $.success(true, resp);
        }, 'order_x_product');
    });
})