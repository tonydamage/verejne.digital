"""Utility methods for data handling."""

import io
import json
import unicodedata
import yaml


def remove_accents(s):
    s_NFKD = unicodedata.normalize('NFKD', s)
    return u''.join([c for c in s_NFKD if not unicodedata.combining(c)])


def json_load(path):
    with open(path, 'r') as f:
        data_json = json.load(f)
    return data_json


def json_dump_utf8(var, path, indent=4, flatten_level=None):
    with io.open(path, 'w', encoding='utf-8') as f:
        data = json.dumps(var, f, indent=indent, sort_keys=True, separators=(',', ': '), ensure_ascii=False)
        if (indent is not None) and (flatten_level is not None):
            flatten_string = '\n' + ' '*(indent*flatten_level)
            data = data.replace(flatten_string, ' ')
            data = data.replace('\n' + ' '*(indent*(flatten_level-1)) + ']', ']')
        f.write(unicode(data))


def yaml_load(path):
    with open(path, 'r') as f:
        data_yaml = yaml.load(f)
    return data_yaml


def execute_script(db, path):
    """Executes SQL script at `path` on database `db`."""
    with open(path, 'r') as f:
        db.execute(f.read())
