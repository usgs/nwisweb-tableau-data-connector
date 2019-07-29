To improve test coverage of Vue components

Proposed Tests:

    CountySelect.vue
        Test getCounties() by supplying state name and checking that counties are retrieved
        Test getCountyNameFromCode() by providing county code and checking if county name is retrieved

    Main.vue
        browserWarning() sets off alert
        fetchData() loads data into state data and param data
        initializeWebDataConnector() check that myConnector is initialized properly
    
    ParamSelect.vue
        fetchParams() loads data into paramList
