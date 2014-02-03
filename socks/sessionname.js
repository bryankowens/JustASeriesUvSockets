exports.func = function(socket){
	console.log("New Session: " + socket.id);
	socket.emit("sessiontype",{uid:socket.id, msg:"Session Connection"});
}    

exports.name = function(){
  return "sessionname";
}