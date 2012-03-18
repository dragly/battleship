var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.status;
handle["/newUser"] = requestHandlers.newUser;
handle["/randomGame"] = requestHandlers.randomGame;
handle["/placeBoats"] = requestHandlers.placeBoats;
handle["/placeBomb"] = requestHandlers.placeBomb;

server.start(router.route, handle);
