function getParameterByName(name) {
    var data=jQuery.deparam.fragment();
    //name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    //var regex = new RegExp("[\\#?&]" + name + "=([^&#]*)"),
    //    results = regex.exec(location.search);
    //return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    var value = eval('data.' + name);
    return value;
}


function guid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
