#!/usr/bin/env bash
cd $(dirname $(realpath "${BASH_SOURCE[0]}"))

date_i() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

index.ζ backup > $(cat to.txt)/$(date_i).json
