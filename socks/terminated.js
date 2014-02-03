exports.func = function(socket){
	console.log("Disconnecting: " + socket.id);
	socket.emit("terminated",{uid:socket.id, msg:"Terminated Connection"});
}    

exports.name = function(){
  return "terminated";
}