function coersion(isFree, type, data) {
    if (type == 'String') { return '"'+data+'"'}
    if (type == 'Fixnum') {
        if (isFree && data == '') return 0;
        var result = parseInt(data);
        if (isNaN(result)) { return 0;}
        return result;
    }
    if (type == 'Float') {
        if (isFree && data == '') return 0.0;
        var result = parseFloat(data);
        if (isNaN(result)) { return 0.0;}
        return result;
    }
    if (type == 'Boolean') {
        if (isFree && data == '') return false;
        return (data == "true").toString();
    }
    if (type == 'Array') {
        if (isFree && data == '') return '[]';
        if (isFree) return data;
        var result = data.match(/^\[(\w*\,{0,1})*\]$/i);
        if ( result == null ) { return '[]'; }
        return data;
    }
    if (isFree && data == '') return 'nil';
    return data;
};

function drawCategoryList() {
  $.each(documentation, function(i, category) {
    text = category.name + ' (' + category.commands.length + ')'
    $('#left-pan').append('<h2>' + text + '</h2>');
    $('#left-pan').append('<ul></ul>');
      drawCommandList(category, i);
  });
};

function drawCommandList(category, id_cat) {
    $.each(category.commands, function(i, command) {
        $('#left-pan ul:last').append('<li data-cat-id="'
                                      +id_cat+'" data-command-id="'+i+'">'
                                      + command.name + '</li>');
    });
};

function rewriteCommandDisplay() {
    $('#intro').hide();
    $('.aCommand').show().empty();
    cat = $(this).data('cat-id');
    com = $(this).data('command-id');
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
        + makeGenerateCmdButton(category_index, command_index)
        + (params.length != 0 ? makeCleanButton() : '');
  return data;
};

function makeCommandTitle(command, params) {
  data = command.name;
  if (params.length != 0) {
    data += '(' + $.map(params, function(i) {return i.name}).join(', ') + ')';
  };
  return data;
}

function parse_name(command) {
    return (command.name[0] == '*') ? 'DEF_'+command.name.substring(1) : command.name; 
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
                + '<td class="center"> <input id="polymorph_'+parse_name(p)+'" type="checkbox"'
                + ((p.type != 'String') ? 'checked=checked':'') + '></td>'
                + '<td><input id="arg_'+ parse_name(p)
                + '" class="arginput" type="text" placeholder="valeur à attribuer"></td>'
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
          + '<td colspan="4"><input id="return_in" class="arginput" type="text" placeholder="Variable dans laquelle générer la commande"></td>'
          + '</tr>';
  } else {
    return '';
  };
}

function makeGenerateCmdButton(category_index, command_index) {
  return '<input id="buildCmd" type="button" value="Generer la commande" onclick="generateCmd('
          + category_index + ',' + command_index + ')">'
}

function makeCleanButton(returnable) {
  return '<input id="cleanCmd" type="button" value="Nettoyer les valeurs" onclick="cleanValues()">'
}

function generateCmd(category_index, command_index) {
    var category = documentation[category_index];
    var command  = category.commands[command_index];
    var params   = jQuery.map(command.parameters, function(e) {
        var id = '#arg_' + parse_name(e);
        var poly  = '#polymorph_' + parse_name(e);
        return {type: e.type, name: e.name, value: $(id).val(), poly:$(poly).prop('checked')};
    });
    var params_filter = jQuery.grep(params, function(e) {
        return !(e.name[0] == '*' && e.value == ''); 
    });
    var parsed_params = jQuery.map(params_filter, function(e) {
        return coersion(e.poly, e.type, e.value);
    });
    var data = command.name + ( (parsed_params.length > 0) ? '(' + parsed_params.join(', ') + ')' : '');
    var vdata = $('#return_in').val();
    var p_data = ((command.returnable && vdata != '') ? vdata + ' = ' : '') + data
    window.prompt("Copier dans le presse-papier : CTR+C suivi de ENTER", p_data);
}

function cleanValues() {
  $('input.arginput').val('');
}

$(function() {
  drawCategoryList();
  $('#left-pan li').on('click', rewriteCommandDisplay);
});
