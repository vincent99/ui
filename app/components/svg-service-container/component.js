import Ember from 'ember';

export default Ember.Component.extend({
  resourceActions: Ember.inject.service('resource-actions'),

  node: null,


  tagName: 'g',
  attributeBindings: ['transform'],

  width: 235,
  height: 80,

  actions: {
    showDropDown: function(evt) {
      this.get('resourceActions').show(this.get('node.service'), Ember.$('#dropdown-toggler'), this.$());
    }
  },

  transform: Ember.computed('node.{x,y}', function() {
    return `translate(${this.get('node.x')},${this.get('node.y')})`;
  }),

  containerCount: Ember.computed('node.service.instances', function() {
    if (this.get('node.service.instances')) {
      return this.get('node.service.instances').length;
    } else {
      return this.get('node.service.scale') ? this.get('node.service.scale') : 0;
    }
  }),

  stateBackground: function() {
    return this.get('node.service.stateColor').replace("text-","bg-");
  }.property('node.service.stateColor'),

});
