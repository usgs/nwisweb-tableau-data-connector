[![Codacy Badge](https://api.codacy.com/project/badge/Grade/69b4de1c8467444ab8e956083f904a72)](https://www.codacy.com/app/rsreenivasam-usgs/nwisweb-tableau-data-connector?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=usgs/nwisweb-tableau-data-connector&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/usgs/nwisweb-tableau-data-connector.svg?branch=master)](https://travis-ci.org/usgs/nwisweb-tableau-data-connector)
[![Coverage Status](https://coveralls.io/repos/github/usgs/nwisweb-tableau-data-connector/badge.svg?branch=master)](https://coveralls.io/github/usgs/nwisweb-tableau-data-connector?branch=master)

# NWISWeb Tableau Data Connector

This system is designed to be used with the Web Data Connector feature of Tableau Desktop. It allows for quickly parameterizing queries to the NWISWeb Instantaneous values services, and supplying the resulting data to Tableau in a user-friendly format. This project is in active development. 

## Project setup
```
npm install
npm run fetch  
```

Note that npm run fetch gathers some of the data the interface uses from online sources. The interface will not function without this data.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run production-build
```

### Compiles and minifies for development
```
npm run development-build
```

The production build contains analytics, and the devlopment bulid does not. Builds sent to public facing buckets use production-build, and other builds use development-build. 

### Run your tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```
The linter cannot see tableau so to supress warnings /*global  tableau:true*/
must be added to any file which contains references to tableau.





### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
