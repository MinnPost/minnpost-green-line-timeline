/**
 * Main application file for: minnpost-green-line-timeline
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
define('minnpost-green-line-timeline', [
  'jquery', 'underscore', 'mpConfig', 'mpFormatters',
  'helpers', 'moment', 'jquery-vertical-timeline',
  'text!templates/application.underscore',
  'text!templates/loading.underscore'
], function(
  $, _, mpConfig, mpFormatters,
  helpers, moment, jqv,
  tApplication, tLoading
  ) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    this.$el = $(this.el);
    this.$ = function(selector) { return this.$el.find(selector); };
    this.loadApp();
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {
      var thisApp = this;

      // Create main application view
      this.$el.html(_.template(tApplication, {
        data: { }
      }));

      // Custom group function as byDecade doesn't seem to work right
      // for oldest first
      var groupSegmentByDecade = function(row, groups, direction) {
        var year = row.date.year();
        var yearStr = year.toString();
        var id = yearStr.slice(0, -1);
        var start = moment(id + '0-01-01T00:00:00');
        var end = moment(id + '9-12-31T12:59:99');

        if (_.isUndefined(groups[id])) {
          groups[id] = {
            id: id,
            groupDisplay: id + '0s',
            timestamp: (direction == 'newest') ? end.unix() : start.unix(),
            timestampStart: start.unix(),
            timestampEnd: end.unix() - 2000
          };
        }
        return groups;
      };

      // Create timeline
      this.$('.timeline-jquery-greenline').verticalTimeline({
        key: '1mw9b19ubv2iesoQiNyu36t4Pkeg3UGNqhkawe8-nBdA',
        sheetName: 'greenline',
        tabletopOptions: {
          // Parameterize doesn't work anymore because Tabletop
          // tries to look at CORS and ignores paramterize option
          // if find CORS.  :(
          parameterize: '//gs-proxy.herokuapp.com/proxy?url='
        },
        defaultDirection: 'oldest',
        groupFunction: groupSegmentByDecade
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
