function drawCategoryList() {
  $.each(documentation, function(i, category) {
    text = category.name + ' (' + category.commands.length + ')'
    $('#left-pan').append('<h2>' + text + '</h2>');
    $('#left-pan').append('<ul></ul>');
    drawCommandList(category);
  });
};

function drawCommandList(category) {
  $.each(category.commands, function(i, command) {
    $('#left-pan ul:last').append('<li>'+ command.name + '</li>');
  });
};

$(function() {
  drawCategoryList();
});
