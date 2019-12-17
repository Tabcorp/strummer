lint:
	@./node_modules/.bin/eslint -c .eslintrc lib

performance: lint
	@./node_modules/.bin/mocha performance-test

test: lint performance
	@./node_modules/.bin/mocha

coverage: lint
	@./node_modules/.bin/nyc node_modules/mocha/bin/_mocha

travis: lint coverage performance

.PHONY: lint test performance coverage travis
