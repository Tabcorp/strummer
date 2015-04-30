lint:
	@./node_modules/.bin/eslint -c .eslintrc lib

test: lint
	@./node_modules/.bin/mocha

coverage: lint
	@./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha
	@./node_modules/.bin/istanbul check-coverage --config=istambul.yml

travis: lint coverage

.PHONY: lint test coverage travis
