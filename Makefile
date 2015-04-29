lint:
	@./node_modules/.bin/eslint lib

test: lint
	@./node_modules/.bin/mocha

coverage: lint
	@BLANKET=true ./node_modules/.bin/mocha --reporter html-cov > coverage.html

travis: lint
	@BLANKET=true ./node_modules/.bin/mocha --reporter travis-cov

.PHONY: lint test coverage travis
