test:
	@./node_modules/.bin/mocha

coverage:
	@BLANKET=true ./node_modules/.bin/mocha --reporter html-cov > coverage.html

travis:
	@BLANKET=true ./node_modules/.bin/mocha --reporter travis-cov

.PHONY: test coverage travis
