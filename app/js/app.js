var app = app || {};
var config = getConfig();
var template = function(id){
	return _.template( $('#' + id).html() );
};

$(function() {
    app.view = getMainView();    
});