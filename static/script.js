(function(){
var query = document.getElementById('query');
var results = document.getElementById('results');
var suggestions = document.getElementById('suggestions');
var caught = {};
var mobile = 'ontouchstart' in window;

var bold = function(text, match) {
  return text.replace(new RegExp('(.*?)(' + match + ')(.*)','i'),
      '$1<b>$2</b>$3');
};

var tile = function(pokemon, text) {
  text = text || pokemon.name;
  var html = '<div data="' + pokemon.id + '" class="pokemon';
  if (caught[pokemon.id]) {
    html += ' selected';
  }
  html += '"><span class="' + pokemon.identifier + '"></span>' + text +
      '</div>';
  return html;
}

var choice = function(pokemon, query) {
  var match = new RegExp(query, 'i');
  var number = ('000' + pokemon.id).slice(-3);
  var html = '';
  if (query && number.match(match)) {
    html += tile(pokemon, '<sup>' + bold(number, query) + '</sup> ' +
        pokemon.name);
  } else if (pokemon.name.match(match) || pokemon.identifier.match(match)) {
    html += tile(pokemon, bold(pokemon.name, query));
  } else {
    return '';
  }
  return html;
};

var order = function(entry) {
  var i = 100;
  if (entry.level) {
    return entry.level;
  }
  return POKEMON[entry.id].name.charCodeAt(0);
}

var suggest = function() {
  var options = [];
  for (var id in caught) {
    for (var i in caught[id].evolves) {
      var entry = caught[id].evolves[i];
      if (!caught[entry.id]) {
        entry.from = caught[id];
        options.push(entry);
      }
    }
  }
  options.sort(function(a, b) {
    return order(a) - order(b);
  });
  var html = '';
  for (var option in options) {
    var entry = options[option];
    var pokemon = POKEMON[entry.id];
    var text = entry.from.name;
    if (entry.gender) {
      text += entry.gender == 'female' ? '\u2640' : '\u2642';
    }
    html += '<div class="evolve">' + tile(pokemon) +
        '<small> evolves from</small>' + tile(entry.from, text) + '<small>';
    if (entry.via) {
      html += ' via ' + entry.via;
    }
    if (entry.level) {
      html += ' starting at level ' + entry.level;
    }
    if (entry.time) {
      html += ' during the ' + entry.time;
    }
    if (entry.trigger) {
      html += ' by using a ' + entry.trigger;
    }
    if (entry.hold) {
      html += ' while holding ' + entry.hold;
    }
    if (entry.move) {
      html += ' while knowing ' + entry.move;
    }
    if (entry.happiness) {
      html += ' with at least ' + entry.happiness + ' happiness';
    }
    if (entry.location) {
      html += ' near <a href="http://veekun.com/dex/locations/' +
          entry.location + '">' + entry.location + '</a>';
    }
    if (entry.complex) {
      html += ' (check <a href="http://veekun.com/dex/pokemon/' +
          pokemon.identifier + '#evolution">veekun</a>)';
    }
    html += '</small></div>';
  }
  suggestions.innerHTML = html || '<div class="instructions">' +
      'Clicking Pok\u00e9mon in the menu on the left will mark them as ' +
      'caught. Once added, this area will show available evolutions, ordered ' +
      'by level or item requirement.</div>' +
      '<div class="instructions"><small>This page\'s code is available on ' +
      '<a href="https://github.com/johntoopublic/pokedextrous">Github</a>, ' +
      'all game data and sprites are &copy;' +
      '<a href="http://nintendo.com">Nintendo</a> and sourced from ' +
      '<a href="http://veekun.com/dex">veekun\'s Pok\u00e9dex</a>.' +
      '</small></div>';
}

var filter = function() {
  var html = '';
  for (var id in POKEMON) {
    html += choice(POKEMON[id], query.value);
  }
  results.innerHTML = html;
  suggest();
};

var save = function() {
  var start = NaN;
  var parts = [];
  var keys = Object.keys(caught);
  for (var i = 0; i < keys.length; i++) {
    var k = parseInt(keys[i], 10);
    if (keys[i + 1] == k + 1) {
      start = start || k;
      continue;
    }
    if (start) {
      parts.push('' + start + '-' + k);
    } else {
      parts.push(k);
    }
    start = NaN;
  }
  location.replace('#' + parts.join(','));
}

var load = function() {
  caught = {};
  var parts = location.hash.slice(1).split(',');
  for (var part in parts) {
    var range = parts[part].split('-');
    var start = parseInt(range[0], 10);
    var end = parseInt(range[range.length - 1], 10);
    for (var i = start; i <= end; i++) {
      if (POKEMON[i]) {
        caught[i] = POKEMON[i];
      }
    }
  }
}

var toggle = function(e) {
  var data = parseInt(e.target.getAttribute('data') ||
      e.target.parentNode.getAttribute('data'), 10);
  if (!data) {
    return;
  }
  if (caught[data]) {
    delete caught[data];
  } else {
    caught[data] = POKEMON[data];
  }
  save();
  filter();
  if (query.value) {
    query.focus();
  }
};

// Attempt to allow hiding menu on touch devices.
if (mobile) {
  var start = NaN;
  var drag = 0;
  var left = 0;
  window.addEventListener('touchstart', function(e) {
    if (e.touches.length != 1) {
      return;
    }
    start = e.touches[0].pageX;
  });

  window.addEventListener('touchend', function(e) {
    start = NaN;
    if (!drag) {
      return;
    }
    left = drag > 0 ? 0 : -190;
    search.style.left = left + 'px';
    query.disabled = left == -190;
    drag = 0;
  });

  window.addEventListener('touchmove', function(e) {
    if (e.touches.length != 1 || isNaN(start)) {
      return;
    }
    var dx = e.touches[0].pageX - start;
    if (Math.abs(dx) > 50) {
      drag = dx;
      search.style.left = Math.min(0, dx + left) + 'px';
    }
  });
  suggestions.style.left = '25px';
}

suggestions.addEventListener('click', toggle);
results.addEventListener('click', toggle);
query.addEventListener('keyup', filter);
query.focus();
load();
filter();
})();
