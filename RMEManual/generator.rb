# encoding: iso-8859-1
Encoding.default_external = "iso-8859-1"

TOC = {
  "Introduction" => {
      "Présentation" => "presentation.html",
      "Mise à jour" => "maj.html",
    },
    "Syntaxe revisitée" => {
        "Variable et interrupteurs" => "variables.html",
        "Variable locales et interrupteurs locaux" => "locals.html",
        "Labels et labels locaux" => "labels.html",
        "Affichage dans les messages" => "in-message.html",
      },
}

def left_menu
  result = '<ol class="section-list">'
  TOC.each do |section, content|
    result += '<li>'
    result += '<span class="section-title">'+section+'</span>'
    result += '<ol>'
    content.each do |subsection, url|
      result += ('<li><a href="'+url+'">'+subsection+'</a></li>')
    end
    result += '</ol>'
    result += '</li>'
  end
  return result + '</ol>'
end

layout  = File.open('template/front.html', 'r') { |f| f.read }
header, center, footer = layout.split('{{{SPLIT}}}')
c = [header, left_menu, center, 'contenu',footer].join
File.open('index.html', 'w+') {|f| f.write(c)}
