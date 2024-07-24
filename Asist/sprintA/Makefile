OUT=3NB_1180005_1171311_1131510_1150474_1120710.pdf

all:
	# pandoc -t beamer -o $(OUT) <(cat *.md)
	pandoc \
		--pdf-engine=xelatex \
		--highlight-style kate \
		--table-of-contents \
		--number-sections \
		-o $(OUT) <(cat *.md)
