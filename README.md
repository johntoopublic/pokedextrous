[Pokédextrous](http://johntoopublic.github.io/pokedextrous/) [![weekly users](https://analytics-badge.appspot.com/badge/UA-50859182-5.svg)](https://analytics-badge.appspot.com/)
============

Pokédextrous is a simple page that uses caught Pokémon to generate a list of possible evolutions. Page state is saved via the URL hash, for ease of saving and sharing.

**[static](/static)** is both generated and non-generated site content, which gets pushed to the gh-pages branch:

    git subtree push --prefix static origin gh-pages

It is then updated before pushing after subsequent commits to **master** with

    git subtree push --prefix static . merge && git co gh-pages && \
        git merge merge && git br -D merge

**[icons.png](/static/icons.png)** was generated from [veekun's pokedex-media](http://git.veekun.com/pokedex-media.git/tree/HEAD:/pokemon/icons) via the following command:

    montage `ls +([0-9]).png | sort -n` -geometry +0+0 icons.png

**[generate.py](/generate.py)** creates:
 - [pokedex.js](/static/pokedex.js) JSON reorganized from [veekun's pokedex CSVs](https://github.com/veekun/pokedex/tree/master/pokedex/data/csv).
 - [pokedex.css](/static/pokedex.css) a mapping of the Pokémon identifiers to CSS sprites.
