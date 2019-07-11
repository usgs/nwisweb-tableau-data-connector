<template>
  <div class="about">
    <b style="margin-left: 20px">
      How to use the NWISWeb Tableau Web Data Connector</b
    >
    <p>
      This system requires a desktop Tableau client. To use this system, first
      install a Tableau desktop client on your PC then enter the URL for this
      page under the web data connector option in the connect menu. Details of
      the constraints imposed by the database that feeds this tool are available
      <a href="https://waterservices.usgs.gov/rest/IV-Service.html">here</a>.
    </p>

    <br />
    <br />
    <b style="margin: 20px"> Who is this system designed for ?</b>
    <p>
      This system is designed for users of the Tableau software who want to
      seamlessly integrate USGS Water data into their analytics operations. This
      system is open to the public.
    </p>

    <br />
    <br />
    <b> What does this system provide ?</b>
    <p>
      This system provides USGS Water data and an accompanying Tableau schema
      for each parameter for each site, including geographic coordinates and
      datetimes for each observation. When invoking this system through the
      Tableau web data connector option, the data is automatically loaded into
      Tableau in the format specified by the generated schema.
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  text-align: left;
  margin: 10px 20px 0px 20px;
}
</style>
