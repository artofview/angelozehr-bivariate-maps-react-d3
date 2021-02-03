// Syntax für React!

import React, { Fragment } from 'react';

import { geoPath, geoTransform } from 'd3-geo';
import { scaleLinear, scaleThreshold, scaleOrdinal } from 'd3-scale';               // https://www.npmjs.com/package/d3-scale
import { feature as topojsonFeature } from 'topojson-client';
import bbox from '@turf/bbox';                                                       // https://www.npmjs.com/package/@turf/bbox

import MapLegend from './MapLegend'
import relief from './relief.jpg'
import topoJson from './topo.json'

// convert topojson back to geojson
const geoJson = topojsonFeature(topoJson, topoJson.objects.municipalities);         // json-Object "topoJson.objects.municipalities"

const SwissMap = ({ data = [], width = 1000 }) => {
  
  // get extent of switzerland as x, y coordinates
  const [minX, minY, maxX, maxY] = bbox(geoJson);                                   //Bounding-Box : https://tools.ietf.org/html/rfc7946#section-5

  // calculate aspect ratio and derive height
  const height = ((maxY - minY) / (maxX - minX)) * width;

  // create plain old linear x and y scales
  // this is possible as the swiss coordinate system
  // is linear and 1 x/y unit equals 1 meter
  const x = scaleLinear()
    .range([0, width])
    .domain([minX, maxX]);

  const y = scaleLinear()
    .range([0, height])
    .domain([maxY, minY]);

  // this is where the magic happens
  // read more about the background here:
  // https://bl.ocks.org/mbostock/6216797
  const projection = geoTransform({
    point: function (px, py) {
      this.stream.point(x(px), y(py));
    }
  })

  // this function will create svg paths when
  // passed a geojson feature
  const path = geoPath().projection(projection);

  // create a scale that returns low, medium or high
  // when passed a "mean" (attribute aus data.json) income to it -> https://observablehq.com/@d3/continuous-scales -> https://observablehq.com/@d3/quantile-quantize-and-threshold-scales
  // low    :    -? - 35000
  // medium : 35000 - 45000
  // high   : 45000 - +?
  const meanScale = scaleThreshold()            
    .domain([35000, 45000])         
    .range(['low', 'medium', 'high']);

  // create similar scale for gini values -> "gini" attribute aus data.json (gini-index als angabe der gleich (0) oder ungleich (1) verteilung des income)
  // low    :  -? - 0.4
  // medium : 0.4 - 0.5
  // high   : 0.5 - +?
  const giniScale = scaleThreshold()
    .domain([0.4, 0.5])
    .range(['low', 'medium', 'high']);

  // create scale that returns a hex code
  // based on mean income and gini values
  const bivariateColorScale = scaleOrdinal()
    .domain([
      'high high',
      'high medium',
      'high low',
      'medium high',
      'medium medium',
      'medium low',
      'low high',
      'low medium',
      'low low'
    ])
    .range([
      '#3F2949', // high inequality, high income
      '#435786',
      '#4885C1', // low inequality, high income
      '#77324C',
      '#806A8A', // medium inequality, medium income
      '#89A1C8',
      '#AE3A4E', // high inequality, low income
      '#BC7C8F',
      '#CABED0' // low inequality, low income
    ]);

  // add the fill to the data array
  var do4everyItem = function(d) {
    const meanGroup = meanScale(d.mean);
    const giniGroup = giniScale(d.gini);
    const fill = bivariateColorScale(`${meanGroup} ${giniGroup}`);
    return { ...d, fill };
  };
  
  // Die map() (engl. abbilden) Methode wendet auf jedes Element des Arrays die bereitgestellte Funktion an und gibt das Ergebnis in einem neuen Array zurück. -> https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  const dataWithFill = data.map(d => { return do4everyItem(d); } );
  

  return (
    <Fragment>
      <div style={{ position: 'relative', width, height }}>
        
        {/* plot relief at reduced opacity first }                
        <img
          src={relief}
          style={{ opacity: 0.4, width: '100%', height: 'auto' }}
          alt=''
        />
        */}
        

        {/* plot choropleth on top */}
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/*<MapLegend
            bivariateColorScale={bivariateColorScale}
            leftText={'High<br />income'}
            rightText={'High<br />inequality'}
          />*/}
          {geoJson.features.map(feature => {
            // find the corresponding fill in the new data array
            // use magenta as a fallback if nothing is found
            const datumWithFill = dataWithFill.find(
              d => d.bfsId === feature.properties.bfsId
            ) || { fill: 'magenta' }
            return (
              <path
                key={`path-${feature.properties.bfsId}`}
                stroke='white'
                strokeWidth={0.25}
                d={path(feature)}
                fill={datumWithFill.fill}
              />
            )
          })}
        </svg>

      </div>
    </Fragment>
  )
}

export const widthEqual = (prevProps, nextProps) =>
  prevProps.width === nextProps.width

export default React.memo(SwissMap, widthEqual)
