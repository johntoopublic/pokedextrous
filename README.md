[Pokédextrous](http://johntoopublic.github.io/pokedextrous/)
============

Pokédextrous is a simple page that allows uses caught Pokémon to generate a list of possible evolutions.

**[static](/static)** is both generated and non-generated site content, which gets pushed to the gh-pages branch:

    git subtree push --prefix static origin gh-pages

**[icons.png](/static/icons.png)** was generated from [veekun's pokedex-media](http://git.veekun.com/pokedex-media.git/tree/HEAD:/pokemon/icons) via the following command:

    montage `ls +([0-9]).png | sort -n` -geometry +0+0 icons.png

**[generate.py](/generate.py)** creates:
 - [pokedex.js](/static/pokedex.js) JSON reorganized from [veekun's pokedex CSVs](https://github.com/veekun/pokedex/tree/master/pokedex/data/csv).
 - [pokedex.css](/static/pokedex.css) a mapping of the Pokémon identifiers to CSS sprites.
