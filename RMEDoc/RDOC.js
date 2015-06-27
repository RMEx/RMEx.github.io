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
  $('#intro').hide();
  $('.aCommand').empty();
  cat = $(this).parent().index('#left-pan ul');
  com = $(this).index();
  command = documentation[cat].commands[com];
  content = '<span class="categoryName">' + documentation[cat].name + '</span>'
          + ' → '
          + '<span class="cmdName">' + command.name + '</span>'
          + '<h1>' + command.name + '</h1>'
          + '<p class="desc">' + command.description + '</p>'
  $('.aCommand').append(content)
};

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay)
});
