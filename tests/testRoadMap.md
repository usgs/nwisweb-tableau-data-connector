To improve test coverage of Vue components

Proposed Tests:

    AgencySelect.vue
    
    CoordinatesInput.vue

    CountySelect.vue
        Test getCounties() by supplying state name and checking that counties are retrieved
        Test getCountyNameFromCode() by providing county code and checking if county name is retrieved
        Test addCountyToCounties() with valid and invalid cases
        Test removeElement() by removing from hardcoded list 

    HUCInput.vue

    LocationQueryType.vue

    Main.vue
        Test that browserWarning() sets off notification
    
    ParamSelect.vue

    SiteTypeList.vue
        Test that site type list is fully populated
        Snapshot testing for verifying UI?

    StateSelect.vue
