/**
 * Ambient module declaration for ``plotly.js-cartesian-dist-min``.
 *
 * The package only ships a pre-built UMD JavaScript bundle and no TypeScript
 * declarations. We declare it here so the bundler-aware TS resolver does not
 * fail; the runtime shape is a structural subset of ``plotly.js`` (typed via
 * ``@types/plotly.js``) and ``react-plotly.js/factory`` only consumes a few
 * methods at runtime (``newPlot``, ``react``, ``Plots.resize``, etc.).
 */

declare module "plotly.js-cartesian-dist-min" {
  const Plotly: unknown;
  export default Plotly;
}
