# Bivariate maps with react and d3

## Status

Aktuell umgebaut nach "Vite" (da scheinbar react-scripts nicht mehr weiterentwickelt wird und Vite schneller ist)

## Idee

Read more about how to map Swiss coordinates (LV95, CH1903+) in these blog-posts:

- [Mapping Swiss coordinates (LV95) with d3: Part 1](https://blog.az.sg/posts/mapping-switzerland-1/)
- [Mapping Swiss coordinates (LV95) with d3: Part 2](https://blog.az.sg/posts/mapping-switzerland-2/)

It is the `react` + `d3` version of the bivariate choropleth map with `ggplot` + `sf` as described in this [this blogpost](https://timogrossenbacher.ch/2019/04/bivariate-maps-with-ggplot2-and-sf/).

The use of react is hereby not sctrictly necessary and much of the code found in `SwissMap.js` is also valid for other programming environments.

The result looks like this:

![](./result.png)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.<br />

### `npm run preview`

Runs the app in the preview mode.<br />

