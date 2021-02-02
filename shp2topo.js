var fs = require('fs');                          //fs.js : https://nodejs.org/api/fs.html#fs_file_system + https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var shapefile = require('shapefile');            //node_modules/shapefile : https://www.npmjs.com/package/shapefile
var topojson = require('topojson-server');       //node_modules/topojson-server : https://www.npmjs.com/package/topojson-server

//specify the output file here
//via: https://shop.swisstopo.admin.ch/de/products/landscape/boundaries3D
//const inputFile = './shapefiles/SHAPEFILE_LV95/swissTLMRegio_BEZIRKSGEBIET_LV95.shp'
//const inputFile = './shapefiles/SHAPEFILE_LV95/swissTLMRegio_KANTONSGEBIET_LV95.shp'
const inputFile = './shapefiles/SHAPEFILE_LV95/swissTLMRegio_HOHEITSGEBIET_LV95.shp'
//via: https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.assetdetail.15724821.html
//const inputFile = './gde-1-1-15.shp'

//specify the output file here
const outputFile = './src/topo.json'            //topojson-File

shapefile
  .open(inputFile)
  .then(source => {

    //
    //Returns a promise that yields a GeoJSON feature collection for specified shapefile shp -> https://geojson.org/geojson-spec.html#feature-collection-objects
    //Definiton von GeoJSON Format (FeatureCollection) via RFC : https://tools.ietf.org/html/rfc7946
    //Feature : https://geojson.org/geojson-spec.html#feature-objects

    // start with empty geojson skeleton (Definition von GeoJSON "FeatureCollection")
    let geojson = {
      type: 'FeatureCollection',
      features: [] // into this array we push our features below
    }

    console.log('TEST');

    return source.read().then(function log (result) {

      // when done: pass geojson to next function in promise pipeline
      if (result.done)
        return geojson;

      var i = 0;
      if (result.value.properties.NAME === "Niederbipp")               //bei "swissTLMRegio_HOHEITSGEBIET_LV95.shp"
      //if (result.value.properties.Secondary_ === "Niederbipp")          //bei "gde-1-1-15.shp"
          i++;

      // if not done: add to geojson feature by feature -> Destructuring assignment
      const feature = {
        ...result.value,
        // keep from properties only the bfs id
        properties: {
          bfsId: result.value.properties.BFS_ID
        }
      }      

      geojson.features.push(feature);

      // continue with next feature/iteration
      return source.read().then(log);
    })
  })
  // convert to topojson with quantization = 1e3
  .then(geojson => topojson.topology({ municipalities: geojson }, 1e3))
  // write to file
  .then(fileContent =>
    fs.writeFile(outputFile, JSON.stringify(fileContent), () => {
      console.log('The file has been saved!')
    })
  )
  .catch(console.error)
