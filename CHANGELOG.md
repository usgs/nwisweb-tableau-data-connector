# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2019-06-28
### Added
- Added CHANGELOG.md
- Added Coordinates as a location query parameter
- Added form input verification and corresponding test battery for site,state,and coordinate input
- inactive location parameter forms are now hidden
- added input form for hydrological unit codes
- added input form for up to 10 counties
- added longitude and latitude columns to data Schema
- updated time column in schema to use tableau's datetime format, and created a script to translate into tableau-compliant datetime format. 
- added unit code column to the schema
- added about page
- added search menu for parameter codes
- Added input for selection of multiple site types by user
- Added support for semantic versioning into project
- Jenkinsfile.build will now allow users to automatically increment version numbers in package.json and add git tags to builds
- Added ability to filter by agency code in queries
- Added data flag column to schema generated for data returned
- Added Tableau Desktop Compatible alerts
- Added Tooltips to support usability when datalist is not supported
- Added support for Ground Water Site Attributes
- Added support for National and Local Aquifer codes
### Changed
- Changed styling so all elements are left justified


