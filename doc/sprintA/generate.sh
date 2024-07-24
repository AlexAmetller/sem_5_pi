#!/usr/bin/env bash

shopt -s globstar

plantuml -tsvg ./**/*.puml -o svg -checkmetadata
