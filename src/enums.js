/*
enum for location query mode (site id, state, coordinate box, watershed etc...).
Note that these location query modes are mutually exclusive.
*/
const locationMode = {
  SITE: "site",
  STATE: "state",
  COORDS: "coordinates",
  HYDRO: "hydrological unit code",
  COUNTY: "county"
};

export { locationMode };
