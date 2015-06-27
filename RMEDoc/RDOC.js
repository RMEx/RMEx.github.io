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
  content = makeContent(cat, com);
  $('.aCommand').append(content);
};

function makeContent(category_index, command_index) {
  category = documentation[category_index];
  command  = category.commands[command_index];
  params   = command.parameters;
  data = '<span class="categoryName">' + category.name
        + '</span> → <span class="cmdName">' + command.name + '</span>'
        + '<h1>' + makeCommandTitle(command, params) + '</h1>'
        + '<p class="desc">' + command.description + '</p>'
        + makeParametersTable(command, params)
        + '<input id="buildCmd" type="button" value="Generer la commande" onclick="generateCmd('
        + category_index + ',' + command_index + ')">'
        + ' <input id="cleanCmd" type="button" value="Nettoyer les valeurs" onclick="cleanValues()">';
  return data;
};

function makeCommandTitle(command, params) {
  data = command.name;
  if (params.length != 0) {
    data += '(' + $.map(params, function(i) {return i.name}).join(', ') + ')';
  };
  return data;
}

function makeParametersTable(command, params) {
  if (params.length == 0) {
    return '<table class="args"><tbody>' + makeReturnableGen(command) + '</tbody></table>'
  } else {
    data = '<h2>Arguments</h2><table class="args"><tbody><tr>';
    $.each(['Argument', 'Description', 'Type', 'Libre?', 'Valeur'], function(i, v) {
      data += '<td class="title">' + v + '</td>';
    });
    data += '</tr>';
    $.each(params, function(i, p) {
      data += '<tr>'
            + '<td>' + p.name + '</td>'
            + '<td>' + p.desc + '</td>'
            + '<td><code>' + p.type + '</code></td>'
            + '<td class="center"><input id="polymorph" type="checkbox"></td>'
            + '<td><input class="arginput" type="text" placeholder="valeur à attribuer"></td>'
            + '</tr>';
    });
    data += makeReturnableGen(command) + '</tbody></table>';
    return data;
  };
}

function makeReturnableGen(command) {
  if (command.returnable) {
    return '<tr>'
          + '<td class="title">Générer dans</td>'
          + '<td colspan="4"><input class="arginput" type="text" placeholder="Variable dans laquelle générer la commande"></td>'
          + '</tr>';
  } else {
    return '';
  };
}

function generateCmd(category_index, command_index) {
  category = documentation[category_index];
  command  = category.commands[command_index];
  params   = command.parameters;
  data = command.name + '(' + params.join(', ') + ')';
  window.prompt("Copy to clipboard: Ctrl+C, Enter", data);
}

function cleanValues() {
  $('input.arginput').val('');
}

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay);
});
