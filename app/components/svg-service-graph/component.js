import Ember from 'ember';
import ThrottledResize from 'ui/mixins/throttled-resize';
import { debouncedObserver } from 'ui/utils/debounce';

const margin        = 20;
const groupMargin   = 15;
const groupPadding  = 15;
const cornerRadius  = 5;
const nudgeGap      = 5;
const arrowWidth    = 7;
const arrowHeight   = 7;

export default Ember.Component.extend(ThrottledResize,{
  // Component inputs
  services: null,
  environment: null,

  // Views
  tagName: 'svg',
//  attributeBindings: ['width','height','xmlns','viewBox'],

  width: null,
  height: null,
  xmlns:"http://www.w3.org/2000/svg",
  viewBox: '0 0 800 400',

  nodes: null,
  paths: null,

  // ----------
  //
  didInitAttrs() {
    this.updateGraph();
  },

  onResize: function() {
    var $main = $('MAIN');

    this.$().css({
      width: $main.width(),
      height: $(window).height() - $main.position().top
    });
  },

  // ----------

  unremovedServices: function() {
    return this.get('services').filter(function(service) {
      return ['removed','purging','purged'].indexOf(service.get('state')) === -1;
    });
  }.property('services.@each.state'),

  // Services that are cross-linked from another environment
  crosslinkServices: function() {
    var out = [];

    this.get('unremovedServices').forEach((service) => {
      var externals = (service.get('consumedServicesWithNames')||[]).filter((linked) => {
        return linked.get('service.environmentId') !== this.get('environment.id');
      }).map((linked) => { 
        return linked.get('service');
      });

      out.pushObjects(externals);
    });

    return out;
  }.property('unremovedServices.@each.consumedServicesUpdated','environment.id'),

  graphShouldChange: debouncedObserver(
    'unremovedServices.@each.{id,name,state,consumedServicesUpdated}',
    'crosslinkServices.@each.{id,name,state,displayEnvironment}',
    function() {
      this.updateGraph();
  }, 250),

  updateGraph: function() {
    var nodes = [];
    var links = [];
    var paths = [];
    var index = 0;

    var svcIndex = {};

    function newNode(service,cross) {
      var serviceId = service.get('id');
      var obj = {
        id: serviceId,
        index: index++,
        service: service,
        isCross: cross,
        width: 235,
        height: 80,
      };

      nodes.push(obj);
      svcIndex[serviceId] = obj.index;
    }

    // Add all the services in this environment
    this.get('unremovedServices').forEach((service) => { newNode(service, false); });

    // And then ones cross-linked in
    this.get('crosslinkServices').forEach((service) => { newNode(service, true); });

    // Then all the links
    this.get('unremovedServices').forEach((service) => {
      var sIdx = svcIndex[service.get('id')];
      if ( sIdx >= 0 )
      {
        (service.get('consumedServicesWithNames')||[]).forEach(function(map) {
          var tIdx = svcIndex[map.get('service.id')];
          if ( tIdx >= 0 )
          {
            links.push({
              id: map.get('id'),
              source: sIdx,
              target: tIdx,
              label: map.get('name'),
              dotted: map.get('service.state') !== 'active'
            });
          }
        });
      }
    });

/*
    var nodeRadius = 10,
        realGraphNodes = nodes.slice(0),
        topLeft = { x: 0, y: 0, fixed: true },
        tlIndex = nodes.push(topLeft) - 1,
        bottomRight = { x: this.get('width'), y: this.get('height'), fixed: true },
        brIndex = nodes.push(bottomRight) - 1,
        constraints = [];

    for (var i = 0; i < realGraphNodes.length; i++) {
      constraints.push({ axis: 'x', type: 'separation', left: tlIndex, right: i, gap: nodeRadius });
      constraints.push({ axis: 'y', type: 'separation', left: tlIndex, right: i, gap: nodeRadius });
      constraints.push({ axis: 'x', type: 'separation', left: i, right: brIndex, gap: nodeRadius });
      constraints.push({ axis: 'y', type: 'separation', left: i, right: brIndex, gap: nodeRadius });
    }
*/


    var pgLayout = cola.powerGraphGridLayout(
      {nodes: nodes, links: links},
      [this.get('width'), this.get('height')],
      groupPadding, // Group Padding
      margin,
      groupMargin
    );//.constraints(constraints);

    var routes = cola.gridify(pgLayout, nudgeGap, margin, groupMargin);
    routes.forEach(route => {
        var p = cola.GridRouter.getRoutePath(route, cornerRadius, arrowWidth, arrowHeight);
        paths.push({d: p.routepath});
    });


    this.setProperties({
      nodes: nodes, //realGraphNodes,
      paths: paths
    });
  },
});
