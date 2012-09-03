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

var computeQuery = function() {
  query = { 
    'regexp': $('#regexp').val(),
    'filetypes': $('#filetypes').val(),
    'caseinsensitive': $('#caseinsensitive')[0].checked
  }
  return query;
}

var execute = function() {
  $('#spinner').show();
  $('#error_message').hide();
  query = computeQuery();
  $.ajax({
    url: "/q",
    dataType: "json",
    data: query
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
}

$('#submit').click(function(e) {
  e.stopPropagation();
  execute();
});

// Listen for changes and update hash
$('#regexp').keyup(function() { 
  $.bbq.pushState( computeQuery() );
  execute();
});

$().ready(function() {
  if ($.bbq.getState("regexp")) {
    $('#regexp').val($.bbq.getState("regexp"));
    $('#filetypes').val($.bbq.getState("filetypes"));
    $('#caseinsensitive')[0].checked = $.bbq.getState("caseinsensitive");
  }
});
