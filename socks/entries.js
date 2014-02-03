exports.func = function(socket){
	console.log("Why am I throwing this function?");
	socket.emit("entries",{uid:socket.id, msg:"Updated entries"});
}    

exports.name = function(){
  return "entries";
}