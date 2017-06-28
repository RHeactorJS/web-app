.PHONY: help clean development

build/%.html: assets/%.html includes/*.html test/config.json
	mkdir -p $(dir $@)
	./node_modules/.bin/rheactorjs-build-views build test/config.json -i ./includes/ $< $@

build: build/index.html build/app.min.js build/styles.min.css

dist:
	rm -rf dist
	./node_modules/.bin/babel js -d dist

# JavaScript

build/%.min.js: build/%.js
	@mkdir -p $(dir $@)
ifeq "${ENVIRONMENT}" "development"
	cp $< $@
else
	./node_modules/.bin/uglifyjs $< -o $@
endif

build/%.js: js/%.js js/**/*.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@ -t [ babelify ]

# CSS

build/%.css: scss/%.scss scss/_*.scss build/fonts
	@mkdir -p $(dir $@)
	./node_modules/.bin/node-sass $< $@

build/fonts: node_modules/material-design-icons/iconfont/MaterialIcons-Regular.*
	mkdir -p build/fonts
	cp node_modules/material-design-icons/iconfont/MaterialIcons-Regular.* build/fonts/

build/%.min.css: build/%.css
ifeq ($(ENVIRONMENT),development)
	cp $< $@
else
	./node_modules/.bin/uglifycss $< > $@
endif

# Helpers

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

# Main

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Remove build artefacts
	rm -rf dist build

development: ## Build for development environment
	ENVIRONMENT=development make build
