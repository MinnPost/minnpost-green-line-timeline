/**
 * Main application file for: minnpost-green-line-timeline
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
define('minnpost-green-line-timeline', [
  'jquery', 'underscore', 'mpConfig', 'mpFormatters', 
  'helpers', 'jquery-vertical-timeline',
  
  
  'text!templates/application.underscore',
  'text!templates/loading.underscore'
], function(
  $, _, mpConfig, mpFormatters, 
  helpers, jqv,
  
  
  tApplication, tLoading
  ) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    this.$el = $(this.el);
    this.$ = function(selector) { return this.$el.find(selector); };
    this.$content = this.$el.find('.content-container');
    this.loadApp();
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {
      var thisApp = this;

      
      // Create main application view
      this.$content.html(_.template(tApplication, {
        data: {

        },
        loading: _.template(tLoading, {})
      }));
      
      $('.timeline-jquery-greenline').verticalTimeline({
           key: '1mw9b19ubv2iesoQiNyu36t4Pkeg3UGNqhkawe8-nBdA',
           sheetName: 'greenline',
           tabletopOptions: {
              parameterize: 'http://gs-proxy.herokuapp.com/proxy?url='
            }
         });
      
    },

    

    // Default options
    defaultOptions: {
      projectName: 'minnpost-green-line-timeline',
      remoteProxy: null,
      el: '.minnpost-green-line-timeline-container',
      availablePaths: {
        local: {
          
          css: ['.tmp/css/main.css'],
          images: 'images/',
          data: 'data/'
        },
        build: {
          css: [
            '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
            'dist/minnpost-green-line-timeline.libs.min.css',
            'dist/minnpost-green-line-timeline.latest.min.css'
          ],
          ie: [
            'dist/minnpost-green-line-timeline.libs.min.ie.css',
            'dist/minnpost-green-line-timeline.latest.min.ie.css'
          ],
          images: 'dist/images/',
          data: 'dist/data/'
        },
        deploy: {
          css: [
            '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/minnpost-green-line-timeline.libs.min.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/minnpost-green-line-timeline.latest.min.css'
          ],
          ie: [
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/minnpost-green-line-timeline.libs.min.ie.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/minnpost-green-line-timeline.latest.min.ie.css'
          ],
          images: 'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/images/',
          data: 'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-timeline/data/'
        }
      }
    },

    // Load up app
    loadApp: function() {
      this.determinePaths();
      this.getLocalAssests(function(map) {
        this.renderAssests(map);
        this.start();
      });
    },

    // Determine paths.  A bit hacky.
    determinePaths: function() {
      var query;
      this.options.deployment = 'deploy';

      if (window.location.host.indexOf('localhost') !== -1) {
        this.options.deployment = 'local';

        // Check if a query string forces something
        query = helpers.parseQueryString();
        if (_.isObject(query) && _.isString(query.mpDeployment)) {
          this.options.deployment = query.mpDeployment;
        }
      }

      this.options.paths = this.options.availablePaths[this.options.deployment];
    },

    // Get local assests, if needed
    getLocalAssests: function(callback) {
      var thisApp = this;

      // If local read in the bower map
      if (this.options.deployment === 'local') {
        $.getJSON('bower.json', function(data) {
          callback.apply(thisApp, [data.dependencyMap]);
        });
      }
      else {
        callback.apply(this, []);
      }
    },

    // Rendering tasks
    renderAssests: function(map) {
      var isIE = (helpers.isMSIE() && helpers.isMSIE() <= 8);

      // Add CSS from bower map
      if (_.isObject(map)) {
        _.each(map, function(c, ci) {
          if (c.css) {
            _.each(c.css, function(s, si) {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              $('head').append('<link rel="stylesheet" href="' + s + '" type="text/css" />');
            });
          }
          if (c.ie && isIE) {
            _.each(c.ie, function(s, si) {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              $('head').append('<link rel="stylesheet" href="' + s + '" type="text/css" />');
            });
          }
        });
      }

      // Get main CSS
      _.each(this.options.paths.css, function(c, ci) {
        $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
      });
      if (isIE) {
        _.each(this.options.paths.ie, function(c, ci) {
          $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
        });
      }

      // Add a processed class
      this.$el.addClass('processed');
    }
  });

  return App;
});


/**
 * Run application
 */
require(['jquery', 'minnpost-green-line-timeline'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
