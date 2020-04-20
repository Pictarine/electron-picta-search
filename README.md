[![GitHub license](https://img.shields.io/github/license/Pictarine/electron-picta-search.svg)](https://github.com/Pictarine/electron-picta-search/blob/master/LICENSE)

# Picta Search <img src="https://user-images.githubusercontent.com/1506323/79753368-1a2e9100-8316-11ea-9f91-d7c6f19f7077.png" width="60" height="60"> 

![PictaSearch](https://user-images.githubusercontent.com/1506323/79753045-92e11d80-8315-11ea-82f7-d629dbcdc96c.png)

This project is a fork from [Dext](https://github.com/DextApp/dext) by [Vu Tran](https://github.com/vutran/).

We found that Dext was a good codebase to start from and decided to add new features to it.

## Installation 

Download the dmg file and open the application.

The assistant can be invoked via the status bar menu or by hitting `option ⌥ + space`

## Changelog

* Fix Insecure warning
* Fix not displaying icons
* Fix bad IPC send to mainProcess for details retrieving
* Fix queryHelper empty array error
* Fix prod webpack
* Fix archive and package scripts
* Fix list-item missing import + add click execut instead of double click
* Rewrite github search plugin (md => html, got => axios)
* Update all dep
* Update BrowserWindow to load node content
* Update mathjs lib eval => evaluate
* Update "open link in browser" with a regex to only present to domain name instead of the whole url
* Update screen saver script for Mojave+, remove screen-saver npm package
* Add Dark Mode for icon in status bar (will create a new icon after)
* Add new status bar menu items to connect 3rd parties account
* Add [applications search](https://github.com/vutran/dext-darwin-applications-plugin) as a core plugin
* Add [giphy search](https://github.com/adnasa/dext-giphy-plugin) as a core plugin
* Add [github search](https://github.com/vutran/dext-github-plugin) as a core plugin
* Add [google search](https://github.com/justinpchang/dext-search-plugin) as a core plugin
* Add Gmail search for content as a core plugin
* Add Drive search for files as a core plugin
* Add Dropbox search for files as a core plugin
* Add Slack search for content as a core plugin
* Add start at login menu item
* Add dmg creation
* Add the possibility to open the app on every screen
* Add deeplink integration for oauth on every services
* MouseOver and arrow keyboard keys are now synced

## Incoming

* Local files search integration
* Better filtering
* New third parties API integration

