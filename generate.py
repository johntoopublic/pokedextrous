#!/usr/bin/env python
import csv
import io # Used explicitly to allow Python2.6 to work.
import json
import os.path

LANGUAGE_ID = '9'

pokedex = os.path.abspath('pokedex/pokedex/data/csv')

pokemon = {}
evolves = {}
items = {}
moves = {}
locations = {}

# Read base info about Pokemon.
species = os.path.join(pokedex, 'pokemon_species.csv')
with io.open(species, encoding='utf-8') as species:
    reader = csv.DictReader(species)
    for row in reader:
        id = int(row['id'])
        pokemon[id] = {
            'id': id,
            'identifier': row['identifier'],
        }
        parent = row['evolves_from_species_id']
        if parent:
            evolves[id] = int(parent)

# Read move names.
move_names = os.path.join(pokedex, 'move_names.csv')
with io.open(move_names, encoding='utf-8') as move_names:
    reader = csv.DictReader(move_names)
    for row in reader:
        if row['local_language_id'] == LANGUAGE_ID:
            id = int(row['move_id'])
            moves[id] = row['name']

# Read item names.
item_names = os.path.join(pokedex, 'item_names.csv')
with io.open(item_names, encoding='utf-8') as item_names:
    reader = csv.DictReader(item_names)
    for row in reader:
        if row['local_language_id'] == LANGUAGE_ID:
            id = int(row['item_id'])
            items[id] = row['name']

# Read location names.
location_names = os.path.join(pokedex, 'location_names.csv')
with io.open(location_names, encoding='utf-8') as location_names:
    reader = csv.DictReader(location_names)
    for row in reader:
        if row['local_language_id'] == LANGUAGE_ID:
            id = int(row['location_id'])
            locations[id] = row['name']

# Read species names.
names = os.path.join(pokedex, 'pokemon_species_names.csv')
with io.open(names, encoding='utf-8') as names:
    reader = csv.DictReader(names)
    for row in reader:
        if row['local_language_id'] == LANGUAGE_ID:
            id = int(row['pokemon_species_id'])
            if id in pokemon:
                pokemon[id]['name'] = row['name']
                pokemon[id]['genus'] = row['genus']

# Read evolution info.
evolution = os.path.join(pokedex, 'pokemon_evolution.csv')
with io.open(evolution, encoding='utf-8') as evolution:
    reader = csv.DictReader(evolution)
    for row in reader:
        id = int(row['evolved_species_id'])
        p = pokemon[evolves[id]]
        if 'evolves' not in p:
            p['evolves'] = []
        e = {
            'id': id,
        }
        if row['evolution_trigger_id'] == '2':
            e['via'] = 'trade'
        if row['evolution_trigger_id'] == '4':
            e['via'] = 'having an empty place and Pok\u00e9ball'
        if row['gender_id']:
            e['gender'] = row['gender_id'] == '1' and 'female' or 'male'
        if row['minimum_level']:
            e['level'] = int(row['minimum_level'])
        if row['time_of_day']:
            e['time'] = row['time_of_day']
        if row['trigger_item_id']:
            e['trigger'] = items[int(row['trigger_item_id'])]
        if row['held_item_id']:
            e['hold'] = items[int(row['held_item_id'])]
        if row['known_move_id']:
            e['move'] = moves[int(row['known_move_id'])]
        if row['minimum_happiness']:
            e['happiness'] = int(row['minimum_happiness'])
        if row['location_id']:
            e['location'] = locations[int(row['location_id'])]
        if (row['known_move_type_id'] or row['minimum_beauty'] or
                row['minimum_affection'] or row['relative_physical_stats'] or
                row['party_species_id'] or row['party_type_id'] or
                row['trade_species_id'] or row['needs_overworld_rain'] != '0' or
                row['turn_upside_down'] != '0'):
            e['complex'] = True
        p['evolves'].append(e)

with io.open(os.path.abspath('static/pokedex.js'), 'w') as out:
    out.write('var POKEMON=' + json.dumps(pokemon) + ';')

with io.open(os.path.abspath('static/pokedex.css'), 'w') as out:
    columns = 28
    width = 40
    height = 30
    css = '''.pokemon span{background-image: url(icons.png);
    display: inline-block; width:%spx; height:%spx}''' % (
            width, height)
    for id in pokemon:
        css += '.%s{background-position:-%spx -%spx}' % (
                pokemon[id]['identifier'],
                (id - 1) % columns * width,
                (id - 1) // columns * height)
    out.write(css)
