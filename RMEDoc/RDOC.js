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
  cat = documentation[cat];
  com = cat.commands[com];
  params = com.parameters;
  content = makeContent(cat, com, params);
  $('.aCommand').append(content);
};

function makeContent(category, command, params) {
  data = '<span class="categoryName">' + category.name
        + '</span> → <span class="cmdName">' + command.name + '</span>'
        + '<h1>' + makeCommandTitle(command, params) + '</h1>'
        + '<p class="desc">' + command.description + '</p>'
        + makeParametersTable(command, params)
        + '<input id="buildCmd" type="button" value="Generer la commande">'
        + ' <input id="cleanCmd" type="button" value="Nettoyer la commande">';
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
    return ''
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
    if (command.returnable) {
      data += '<tr>'
            + '<td class="title">Générer dans</td>'
            + '<td><input class="arginput" type="text" placeholder="Variable dans laquelle générer la commande"></td>'
            + '</tr>';
    };
    data += '</tbody></table>';
    return data;
  };
}

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay)
});
