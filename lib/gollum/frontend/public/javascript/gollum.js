Gollum = {
  encloseStrategy: function(prefix, content, suffix) {
    return {
      type: 'enclose',
      content: content,
      prefix: prefix,
      suffix: suffix
    }
  },

  prefixStrategy: function(prefix, content, newline) {
    return {
      type: 'prefixLine',
      prefix: prefix,
      content: content,
      newline: newline
    }
  },

  enclose: function(el, format, kind) {
    var cfg = Gollum.Formats[format][kind]
    var sel = el.getSelectionRange()
    if (sel.start == sel.end) {
      el.insertText(cfg.prefix + cfg.content + cfg.suffix, sel.start, sel.start, false)
      el.setSelectionRange(sel.start + cfg.prefix.length, sel.start + cfg.prefix.length + cfg.content.length)
    } else {
      el.insertText(cfg.prefix + el.getSelectedText() + cfg.suffix, sel.start, sel.end, false)
    }
  },

  prefix: function(el, format, kind) {
    var cfg = Gollum.Formats[format][kind]
    var sel = el.getSelectionRange()
    var cnt = el.getSelectedText()
    var prefix = cfg.prefix
    if (cfg.newline) {
      el.setSelectionRange(sel.start - 1, sel.start)
      var before = el.getSelectedText()
      if (before != '\n') {
        prefix = '\n' + prefix
      }
    }
    if (sel.start == sel.end) {
      el.insertText(prefix + cfg.content, sel.start, sel.start, false)
      el.setSelectionRange(sel.start + prefix.length, sel.start + prefix.length + cfg.content.length)
    } else {
      el.insertText(prefix + cnt + '\n', sel.start, sel.end, false)
    }
  }
}

Gollum.Formats = {
  asciidoc: {
    bold: Gollum.encloseStrategy('*', 'bold text', '*'),
    italic: Gollum.encloseStrategy('_', 'italic text', '_'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('. ', 'Numbered list item', true)
  },
  creole: {
    bold: Gollum.encloseStrategy('**', 'bold text', '**'),
    italic: Gollum.encloseStrategy('//', 'italic text', '//'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('# ', 'Numbered list item', true)
  },
  gollum: {
    link: Gollum.encloseStrategy('[[', 'Page Name', ']]'),
    image: Gollum.encloseStrategy('[[', '/path/to/image.png', ']]'),
  },
  markdown: {
    bold: Gollum.encloseStrategy('**', 'bold text', '**'),
    italic: Gollum.encloseStrategy('*', 'italic text', '*'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('1. ', 'Numbered list item', true)
  },
  org: {
    bold: Gollum.encloseStrategy('*', 'bold text', '*'),
    italic: Gollum.encloseStrategy('/', 'italic text', '/'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('1. ', 'Numbered list item', true)
  },
  pod: {
    bold: Gollum.encloseStrategy('B<', 'bold text', '>'),
    italic: Gollum.encloseStrategy('I<', 'italic text', '>'),
    ul: Gollum.prefixStrategy('=item * ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('=item 1. ', 'Numbered list item', true)
  },
  rest: {
    bold: Gollum.encloseStrategy('**', 'bold text', '**'),
    italic: Gollum.encloseStrategy('*', 'italic text', '*'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('1. ', 'Numbered list item', true)
  },
  rdoc: {
    bold: Gollum.encloseStrategy('*', 'bold text', '*'),
    italic: Gollum.encloseStrategy('_', 'italic text', '_'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('1. ', 'Numbered list item', true)
  },
  roff: {
    bold: Gollum.encloseStrategy('\\fB', 'bold text', '\\fP'),
    italic: Gollum.encloseStrategy('\\fI', 'italic text', '\\fP')
  },
  textile: {
    bold: Gollum.encloseStrategy('*', 'bold text', '*'),
    italic: Gollum.encloseStrategy('_', 'italic text', '_'),
    ul: Gollum.prefixStrategy('* ', 'Bullet list item', true),
    ol: Gollum.prefixStrategy('# ', 'Numbered list item', true)
  }
}

$(function(){
  /* Version selector */

  $('#versions_select').change(function() {
    location.href = this.value
  })

  /* EditBar */

  $('#editbar .link').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.enclose(el, 'gollum', 'link')
  })

  $('#editbar .image').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.enclose(el, 'gollum', 'image')
  })

  $('#editbar .bold').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.enclose(el, format, 'bold')
  })

  $('#editbar .italic').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.enclose(el, format, 'italic')
  })

  $('#editbar .ul').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.prefix(el, format, 'ul')
  })

  $('#editbar .ol').click(function() {
    var el = $('#guides .write textarea')
    var format = $('#guides .write select[name=format] option:selected').attr('value')
    Gollum.prefix(el, format, 'ol')
  })

  $('#editbar .tab a').click(function() {
    if ($(this).hasClass("open")) {
      $(this).removeClass("open")
    } else {
      $(this).addClass("open")
    }
  })
})