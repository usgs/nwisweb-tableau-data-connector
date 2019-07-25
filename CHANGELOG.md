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
- Added options for Test and QA buckets as targets for Jenkins builds
- Added support for Ground Water Site Attributes
- Added support for National and Local Aquifer codes
- Added site status parameter
- Added watershed area query
- Added Altitude query params
- Added csv processing for quickly adding a lot codes in fields which accept and verify multiple codes
- Added various temporal query parameters
- Added columns to display site number, parameter code, statistic code, agency code, and method code in every row of a table in Tableau
### Changed
- Changed styling so all elements are left justified
- separted sitelist from main.vue
- switched datetime library to momentjs from date-format
- separated sitelist from main.vue
- Users can specify which branch to build on Jenkins build page, the default branch is still master
- Jenkins builds will now check for an existing docker container and delete it if a previous build has failed to clean up
- added visual grouping of optional parameters
