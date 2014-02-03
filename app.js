//var socket = io.connect('http://mcp.hcpprod.com:9090');
var socket = io.connect();

socket.on("pong",function(data){
    if (data.newuser) {
        console.log(data.newuser + " has logged in")
        $("#userlist").add("<div id='"+ data.uid +"' class='listname'>"+ data.uid +"</div>")
    };
    if (data.userlist) {
        for (var i = 0; i < data.userlist.length; i++) {
            $("#userlist").add("<div id='"+ data.userlist[i] +"' class='listname'>"+ data.userlist[i] +"</div>")
        }
    }
    $("<div class='chatrow'><div class='userpane'><div class='userpic'></div><div class='userinfo'>"+data.uid+"</div><div class='usertime'>"+moment().format('h:mm:ss a')+"</div></div><div class='contentpane userchat'>"+data.msg+"</div></div>").appendTo("#chatbox");
});

socket.on("statupdate",function(data){
    switch (parseInt(data.stats.current_state))
    {
        case 0:
            rowclass = "Green";
            break;
        case 1:
            rowclass = "warning";
            break;
        case 2:
            rowclass = "critical";
            break;
        default:
            rowclass = "information";
            break;
    }

    var ackdiv = '<div class="ackpane"><div class="ackuser"></div><div class="ackdelete">Del</div><div class="acknoticed">Ack</div></div>';
    var rowentry = "<div id='"+ data.stats.current_problem_id + "' class='alertrow "+ rowclass +"'>"+ ackdiv +"<div class='alerthost'>"+data.stats.host_name+"</div><div class='alerttime'>"+Date(data.stats.last_check*1000)+"</div><div class='alertmessage'>"+data.stats.plugin_output+"</div>";
    console.log(data.stats);
    $("'#"+data.stats.current_problem_id+"'").length ? newProblem(rowentry, data.stats.current_problem_id) : oldProblem(rowentry,data.stats.current_problem_id);
});

socket.on("entrypong",function(data){
    $('#'+data.statid).remove().fadeOut('fast');
    console.log("The row: " + data.statid +" was deleted by " + data.uid);
    $("<div class='chatrow'><div class='userpane'><div class='userpic'></div><div class='userinfo'>MCP</div><div class='usertime'>"+moment().format('h:mm:ss a')+"</div></div><div class='contentpane userchat'>"+data.uid+": has removed incident #" + data.statid +"</div></div>").appendTo("#chatbox");
})

socket.on("terminated", function(data){
   $('#userlist').children("#"+data.uid).remove();
});

$("#setname").click(function(){
    console.log("My name is: " + $("#userid").val());
    $("#userid").prop('disabled', true);
    socket.emit("login",{uid:$("#userid").val(), msg: " has logged in to " , chat:$("#room").val()});
    window.addEventListener("beforeunload", function(e){
        socket.emit("terminated",{uid:$("#userid").val()});
    }, false);
    $("#room").prop('disabled', true);
});

$("#button").click(function(){
    socket.emit("ping",{msg:$("#message").val(), uid:$("#userid").val(),chat:$("#room").val()});
    $("<div class='chatrow'><div class='userpane'><div class='userpic'></div><div class='userinfo'>"+$("#userid").val()+"</div><div class='usertime'>"+moment().format('h:mm:ss a')+"</div></div><div class='contentpane otheruserchat'>"+$("#message").val()+"</div></div>").appendTo("#chatbox");
    $("<tr class='userchat'><td>"+$("#userid").val()+":"+$("#message").val()+"</td></tr>").appendTo("#chatbox > tbody");
    $("#message").val("");
});

function newProblem(rowentry, statid){
    $(rowentry).appendTo("#alerts").children().find(".ackdelete").bind('click', function() {
        console.log("You" + $("#userid").val() +" have clicked element" + statid);
        $(this).closest(".alertrow").remove();
        socket.emit("entryping",{statid:statid, uid:$("#userid").val()});
    });
};

function oldProblem(rowentry,statid) {
    $(rowentry).remove().fadeOut('fast');
    $(rowentry).appendTo("#alerts").children().find(".ackdelete").bind('click', function() {
        console.log("You" + $("#userid").val() +" have clicked element" + statid);
        $(this).closest(".alertrow").remove();
        socket.emit("entryping",{statid:statid, uid:$("#userid").val()});
    });
};

$(document).ready(function()
{
    var refreshId = setInterval( function()
    {
        //socket.emit("updatestats",{stat:"servicestatuses"});
    }, 30000);
});