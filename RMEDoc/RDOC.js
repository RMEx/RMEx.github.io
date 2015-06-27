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
    $('#left-pan ul:last').append('<li>' + command.name + '</li>');
  });
};

function rewriteCommandDisplay() {
  cat = $(this).parent().index('#left-pan ul');
  com = $(this).index();
  command = documentation[cat].commands[com];
  $('#intro').hide();
  $('.aCommand').empty();
  $('.aCommand').append('<h1>' + command.name + '</h1>');
};

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay)
});
