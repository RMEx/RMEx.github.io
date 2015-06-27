function coersion(isFree, type, data) {
    if (isFree) {return data;}
    if (type == 'String') { return '"'+data+'"'}
    if (type == 'Fixnum') {
        var result = parseInt(data);
        if (result == NaN) { return 0;}
        return result;
    }
    if (type == 'Float') {
        var result = parseFloat(data);
        if (result == NaN) { return 0.0;}
        return result;
    }
    if (type == 'Boolean') {
        return (data == "true").toString();
    }
    if (type == 'Array') {
        var result = data.match(/\[(\w*\,{0,1})*\]/i);
        if ( result == null ) { return '[]'; }
        return data;
    }
    return data;
};

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
  $('.aCommand').show().empty();
  cat = $(this).parent().index('#left-pan ul');
  com = $(this).index();
  command = documentation[cat].commands[com];
  cmdName = command.name
  params = command.parameters
  if (params.length != 0) {
    cmdName += '(' + $.map(params, function(i) {return i.name}).join(', ') + ')';
  };
  content = '<span class="categoryName">' + documentation[cat].name
          + '</span> → <span class="cmdName">' + command.name + '</span>'
          + '<h1>' + cmdName + '</h1>'
          + '<p class="desc">' + command.description + '</p>'
          + parametersTable(params);
  $('.aCommand').append(content);
};

function parametersTable(params) {
  if (params.length == 0) {
    return ''
  } else {
    content = '<h2>Arguments</h2><table class="args"><tbody><tr>';
    $.each(['Argument', 'Description', 'Type', 'Libre?', 'Valeur'], function(i, v) {
      content += '<td class="title">' + v + '</td>';
    });
    content += '</tr>';
    $.each(params, function(i, p) {
      content += '<tr>'
              + '<td>' + p.name + '</td>'
              + '<td>' + p.desc + '</td>'
              + '<td><code>' + p.type + '</code></td>'
              + '<td class="center"><input id="polymorph" type="checkbox"></td>'
              + '<td><input class="arginput" type="text" placeholder="valeur à attribuer"></td>'
              + '</tr>';
    });
    content += '</tbody></table>';
    return content
  };
}

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay)
});
