.PHONY: all test clean

VERSION = $(shell git rev-parse --short=4 HEAD)

install:
	npm i

build:
	set SOLOVAR_VERSION=$(VERSION) &&npm run build
ifeq ($(OS),Windows_NT)
	xcopy /s .\static .\dist\ 
else
	cp -r static dist/static
endif
#	cp humans.txt lib/humans.txt
#	cp LICENSE lib/LICENSE
	cp humans.txt dist/humans.txt
	cp LICENSE dist/LICENSE

publish:
	aws s3 sync --delete --region us-west-2 --cache-control max-age=604800 dist s3://mesh.robrohan.com

clean:
ifeq ($(OS),Windows_NT)
	rmdir /Q /S .cache
	rmdir /Q /S dist
	rmdir /Q /S lib
	rmdir /Q /S coverage
else
	rm -rf lib
	rm -rf coverage
	rm -rf dist
	rm -rf .cache
	rmdir lib
	rmdir coverage
	rmdir dist
	rmdir .cache
endif

test:
	npm run test

start:
ifeq ($(OS),Windows_NT)
	xcopy /s .\static .\dist\ 
else
	cp -r static dist/static
endif
	cp index.html dist/index.html
	npm run start
	cd dist; busboy

release: clean remove_mac_files test build publish

remove_mac_files:
	find ./ -name ".DS_Store" -exec rm {} \;
