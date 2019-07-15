To improve test coverage of Vue components

Proposed Tests:

    AgencySelect.vue
        populateAgencyList() test that elements can be added

    CountySelect.vue
        Test getCounties() by supplying state name and checking that counties are retrieved
        Test getCountyNameFromCode() by providing county code and checking if county name is retrieved
        populateStateList() is populated properly
        PopulateCountyList() is populated with the correct counties for the state

    Main.vue
        browserWarning() sets off alert
        fetchData() loads data into state data and param data
        initializeWebDataConnector() check that myConnector is initialized          properly
    
    ParamSelect.vue
        fetchParams() loads data into paramList
        populateParamList() populates properly

    SiteTypeList.vue
        populateSiteType() populates site types

    StateSelect.vue
        populateStateList populates properly