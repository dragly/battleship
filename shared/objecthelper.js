function ObjectHelper() {
}

// data = object with data
// object = object to get data
// params = params to transfer from data to object
ObjectHelper.copyDataToObject = function(data, object, params) {
    // if params is undefined, copy everything that exists in data
    if(params === undefined) {
        params = Object.keys(data);
    }

    for(var i = 0; i < params.length; i++) {
        var param = params[i];
        object[param] = data[param];
    }
}

if(typeof exports != 'undefined') {
    exports.ObjectHelper = ObjectHelper;
}
