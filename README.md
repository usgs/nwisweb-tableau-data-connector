# NWISWeb Tableau Data Connector

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/33b7e6c604324277b7fd143467c27c29)](https://app.codacy.com/app/rsreenivasam-usgs/nwisweb-tableau-data-connector?utm_source=github.com&utm_medium=referral&utm_content=usgs/nwisweb-tableau-data-connector&utm_campaign=Badge_Grade_Settings)

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
npm run build
```

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
