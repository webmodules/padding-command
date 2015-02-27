# Get Makefile directory name: http://stackoverflow.com/a/5982798/376773.
# This is a defensive programming approach to ensure that this Makefile
# works even when invoked with the `-C`/`--directory` option.
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin
BABEL ?= $(NODE) $(BIN)/babel

JS_FILES := $(wildcard *.js)
COMPILED_FILES := $(JS_FILES:%.js=build/%.js)

compile: $(COMPILED_FILES)

build:
	mkdir -p build

install: node_modules

clean: $(COMPILED_FILES)
	rm -r build

distclean: clean
	rm -r node_modules

node_modules:
	npm install

build/%.js: %.js install build
	$(BABEL) -i runtime -e $< --out-file $@

.PHONY: compile, build, install, clean, distclean
