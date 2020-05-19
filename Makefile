build:
	# sudo spctl --master-disable
	rm -rfv dist
	npm run release

dev:
	npm run start

install:
	npm install

check-sign:
	codesign -dv dist/package/PictaSearch-darwin-x64/PictaSearch.app

check-cert:
	security find-identity -p codesigning -v

check-notarize-logs:
	xcrun altool --notarization-info $(build_id) -u $(username) -p $(psswd)

clear:
	rm -rf ~/Library/Saved\ Application\ State/com.electron.dext.savedState/
	rm -rf ~/Library/Saved\ Application\ State/com.electron.lookr.savedState/
	rm -rf ~/Library/Saved\ Application\ State/com.electron.PictaSearch.savedState/
	rm -rf ~/.dext
	rm -rf ~/Library/Application\ Support/lookr
	rm -rf ~/Library/Application\ Support/PictaSearch

