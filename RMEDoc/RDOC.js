function find_sample(command) {
  return $.grep(rme_samples, function(e) {
    var commands = e.commands;
    return $.inArray(command, commands) >= 0;
  });
}

function ponderate_doc() {
  var res = [];
  var callbackA = function (i, e) {
    $.each (e.commands, function(j, c) {

      var params = $.map (c.parameters, function (p) {
        return p.name;
      });

      var reslt  = [
        c.name,
        e.name, params.join('-'),
        e.desc, c.description
      ];

      res.push({cat_id:i, comm_id:j, data:reslt});
    });
  };
  $.each(documentation, callbackA);
  return res;
};

var pondered = ponderate_doc();

function coersion(isFree, type, data) {
  if (isFree && data != '') return data;
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
    var text = category.name + ' (' + category.commands.length + ')'
    $('#left-pan-content').append('<h2>' + text + '</h2>');
    $('#left-pan-content').append('<ul></ul>');
    drawCommandList(category, i);
  });
};

function has(command) {
  var samples = find_sample(command.name);
  if (samples.length > 0) {
    return 'cmd_has_sample';
  } return 'cmd_has_no_sample';
}

function drawCommandList(category, id_cat) {
  $.each(category.commands, function(i, command) {
    $('#left-pan ul:last').append('<li data-cat-id="'
                                  + id_cat + '" data-command-id="' + i + '">'
                                  + '<span class="'+(has(command))+'"></span> '
                                  + command.name + '</li>');
  });
};


function drawCommandListWithGrep(list) {
  $.each(list, function(i, data) {
    var category = documentation[data.cat_id];
    var command = category.commands[data.comm_id];
    $('#left-pan ul:last').append('<li data-cat-id="'
                                  + data.cat_id+'" data-command-id="'
                                  + data.comm_id+'">'
                                  + '<span class="'+(has(command))+'"></span> '
                                  + command.name + '</li>');
  });
};


function rewriteCommandDisplay() {
  var cat = $(this).data('cat-id');
  var com = $(this).data('command-id');
  $('.current').removeClass();
  $(this).addClass('current');
  rewriteCommandDisplayStartUp(cat, com);
};

function rewriteCommandDisplayWithId() {
  var cmd = $(this).data('cmd');
  cmd = $.grep(pondered, function(e) { return e.data[0] == cmd });
  if (cmd.length > 0) {
    var cat = cmd[0].cat_id;
    var com = cmd[0].comm_id;
    rewriteCommandDisplayStartUp(cat, com);
  }
};


function rewriteCommandDisplayStartUp(x, y) {
  var content = makeContent(x, y);
  $('#intro').hide();
  $('.aCommand').show().empty().append(content);
  $('.btn_go').on('click', rewriteCommandDisplayWithId);
};

function makeContent(category_index, command_index) {
  var category = documentation[category_index];
  var command  = category.commands[command_index];
  var params   = command.parameters;
  window.location.hash = command.name;
  var data = '<span class="categoryName">' + category.name
      + '</span> → <span class="cmdName">' + command.name + '</span>'
      + '<h1>' + makeCommandTitle(command, params) + '</h1>'
      + '<p class="desc">' + command.description + '</p>'
      + makeParametersTable(command, params)
      + makeGenerateCmdButton(category_index, command_index)
      + (params.length != 0 ? makeCleanButton() : '');
  var samples = find_sample(command.name);
  if (samples.length > 0) {
    data += '<div class="samples">';
    data += '<div>';
    $.each(samples, function(i, sample) {
      data += '<div class="sample"><h3 id="sample-'+i+'">' + sample.title +'</h3>';
      data += sample.html;
      data += '<a href="#toc-samples">Remonter</a>'
      data += '</div>';
    });
    data += '</div><div id="toc-samples"><h2>Exemples</h2><ol>';
    $.each(samples, function(i, sample) {
      data += '<li><a href="#sample-'+i+'">'+sample.title+'</a></li>'
    });
    data += '</ol></div>'
    data += '</div>';
  }
  $('.btn_go').on('click', rewriteCommandDisplayWithId);
  return data;
};

function makeCommandTitle(command, params) {
  var data = command.name;
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
    var data = '<h2>Arguments</h2><table class="args"><tbody><tr>';
    $.each(['Argument', 'Description', 'Type', 'Libre?', 'Valeur'], function(i, v) {
      data += '<td class="title">' + v + '</td>';
    });
    data += '</tr>';
    $.each(params, function(i, p) {
      var type = '';
      if(p.type === 'Easing') {
        type = "<a href='https://github.com/RMEx/RME/wiki/Fonctions-d'interpolation'>"+p.type+'</a> (wiki)';
        console.log(type);
      } else if(p.type === 'Key') {
        type = "<a href='https://github.com/RMEx/RME/wiki/Touches-clavier'>"+p.type+'</a> (wiki)';
      } else {
        type = p.type;
      }
      data += '<tr>'
        + '<td>' + p.name + '</td>'
        + '<td>' + p.desc + '</td>'
        + '<td><code>' + type + '</code></td>'
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
  var params   = $.map(command.parameters, function(e) {
    var id = '#arg_' + parse_name(e);
    var poly  = '#polymorph_' + parse_name(e);
    return {type: e.type, name: e.name, value: $(id).val(), poly:$(poly).prop('checked')};
  });
  var params_filter = $.grep(params, function(e) {
    return !(e.name[0] == '*' && e.value == '');
  });
  var parsed_params = $.map(params_filter, function(e) {
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

function mapWithWord(source, word) {
  var reg = new RegExp(word, 'i');
  var len = source.data.length;
  var det = $.map (source.data, function(e, i) {
    var check = reg.test(e);
    var r = (check ? ((word == e) ? 2 : 1) : 0) * (len - i);
    return r;
  }).reduce(function(a, b){return a + b});
  var category = documentation[source.cat_id];
  var command = category.commands[source.comm_id];
  return {pl:command.name,
          cat_id:source.cat_id,
          comm_id:source.comm_id,
          data:det
         };
}

function onSearchChange() {
  var val = $(this).val();
  if (val == '') {
    $('#left-pan-content').empty();
    drawCategoryList();
    $('#left-pan li').on('click', rewriteCommandDisplay);
  } else {
    $('#left-pan-content').empty();
    var pond = $.map (pondered, function(e){
      var result = mapWithWord(e, val);
      return result;
    }).sort(function(a, b) {
      return b.data - a.data;
    });
    var filtered = $.grep (pond, function(e){
      return e.data > 0;
    });
    $('#left-pan-content').append('<h2>Résultats ('
                                  +filtered.length+')</h2>');
    $('#left-pan-content').append('<ul></ul>');
    drawCommandListWithGrep(filtered);
    $('#left-pan li').on('click', rewriteCommandDisplay);
  }
}

$(function() {
  drawCategoryList();
  var cmd = window.location.hash.substring(1);
  cmd = $.grep(pondered, function(e) { return e.data[0] == cmd });
  if (cmd.length > 0) {
    var cat = cmd[0].cat_id;
    var com = cmd[0].comm_id;
    rewriteCommandDisplayStartUp(cat, com);
  }else{
    $('#loading-ef').hide();
    $('#intro-ef').show();
  };
  $('#left-pan li').on('click', rewriteCommandDisplay);
  $('#filters').on('keyup', onSearchChange);
  $('.btn_go').on('click', rewriteCommandDisplayWithId);
  $("#left-pan-filter").stickOnScroll({
    viewport: $("#left-pan")
    // setParentOnStick: true
  });
});
