$('#error_message').hide();

var results = ko.observableArray();

// For ease of template testing...
results.push({
  "repo": "repo",
  "tree": "tree",
  "file": "file",
  "line_no": "-1",
  "line": "line"
});
results.push({
  "repo": "repo",
  "tree": "tree",
  "file": "file",
  "line_no": "-1",
  "line": "line"
});

ko.applyBindings({
  results: results
}, $('#results')[0]);

$('#submit').click(function(e) {
  e.stopPropagation();

  $('#spinner').show();
  $('#error_message').hide();
  query = { 're': $('#regexp').val() };
  $.ajax({
    url: "/q",
    dataType: "json",
    data: { 'q': JSON.stringify(query) }
  }).done(function(x) {
    $('#spinner').hide();
    results.removeAll();
    for (var i = 0; i < x.results.length; i++) {
      results.push({
        repo: x.results[i][0],
        tree: x.results[i][1],
        file: x.results[i][2],
        line_no: x.results[i][3],
        line: x.results[i][4]
      });
    }
  }).error(function(jqXHR, textStatus, errorThrown) {
    $('#spinner').hide();
    $('#error_message').show();
  });
});

