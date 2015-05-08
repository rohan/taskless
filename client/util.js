renderTemplate = function(template, data) {
    var node = document.createElement("div");
    document.body.appendChild(node);
    UI.renderWithData(template, data, node);
    return node;
};

getTimeZone = function() {
  var tz = jstz.determine();
  return tz.name();
}

arrayToObject = function(arr) {
  var out = {};
  var len = arr.length;
  for (var i  = 0; i < len; i++) {
    out[arr[i].name] = arr[i].value;
  }

  return out;
}