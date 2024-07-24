#!/usr/bin/env bash
#
# Run swipl loading an existing database.
# Does not start the server
# Used for manually testing

tmpfile=$(mktemp)

echo $tmpfile

cat<<EOF > "$tmpfile"
:- [
  % './prolog/99_data.pl',
  % './prolog/01_gera_trajeto.pl',
  % './prolog/02_trajeto_menor_tempo.pl',
  % './prolog/03_trajeto_menor_tempo_complexo.pl',
  % './prolog/04_complexidade.pl',
  % './prolog/05_heuristicas.pl'
  % './prolog/06_algo_genetico_base.pl'
  % './prolog/07_algo_genetico_populacao_base.pl'
  % './prolog/08_algo_genetico_cruzamento_aleatorio.pl'
  % './prolog/09_algo_genetico_selecao_nova_geracao.pl'
  './prolog/10_algo_genetico_otimizado.pl'
].
EOF

swipl -s "$tmpfile"
