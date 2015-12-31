#!/usr/bin/env bash
cd "$(dirname $(/usr/local/bin/realpath "${BASH_SOURCE[0]}"))"
PYTHONPATH="/usr/local/lib/python2.7/site-packages" main.py "$@"
