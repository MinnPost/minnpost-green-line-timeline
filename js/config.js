/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    
       'handlebars': {
         exports: 'Handlebars'
       },
       'tabletop': {
         exports: 'Tabletop'
       },
       'isotope': {
         deps: ['jquery']
       },
       'jquery-resize': {
         deps: ['jquery']
       }
    
  },
  baseUrl: 'js',
  paths: {
    
    'requirejs': '../bower_components/requirejs/require',
    'almond': '../bower_components/almond/almond',
    'text': '../bower_components/text/text',
    'jquery': '../bower_components/jquery/dist/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'mpConfig': '../bower_components/minnpost-styles/dist/minnpost-styles.config',
    'mpFormatters': '../bower_components/minnpost-styles/dist/minnpost-styles.formatters',
    'minnpost-green-line-timeline': 'app',
    'tabletop': '../bower_components/tabletop/src/tabletop',
    'moment': '../bower_components/momentjs/min/moment.min',
    'isotope': '../bower_components/isotope/jquery.isotope.min',
    'jquery-resize': '../bower_components/jquery-resize/jquery.ba-resize.min',
    'eventEmitter/EventEmitter': '../bower_components/eventEmitter/EventEmitter.min',
    'eventie/eventie': '../bower_components/eventie/eventie',
    'imagesloaded': '../bower_components/imagesloaded/imagesloaded',
    'jquery-vertical-timeline': '../bower_components/jquery-vertical-timeline/dist/jquery-vertical-timeline.min'
  }
});
