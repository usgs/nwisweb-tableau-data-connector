To improve test coverage of Vue components

Change tests to use mocks of all fetched data

Proposed Tests:

    CountySelect.vue
        Test getCounties() by supplying state name and checking that counties are retrieved
        Test getCountyNameFromCode() by providing county code and checking if county name is retrieved

    AquiferInputs.vue
        Test getLocAquifers() by supplying state name and checking that local aquifers are retrieved
        Test verifyLocAquifers() by providing local aquifer code and checking if local aquifer name is retrieved

    SiteTypeList
	    Test getSiteTypeNameFromCode() by providing site type code and checking if site type name is retrieved
