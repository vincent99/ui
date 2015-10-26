import Ember from 'ember';

export default Ember.Component.extend({
  resourceActions: Ember.inject.service('resource-actions'),

  tagName: 'span',

  classNames: ['graph-actions'],

  model: null,

  click(event) {
    event.preventDefault();
    event.stopPropagation();
    this.get('resourceActions').show(this.get('model'), event.target, this.$());
  },

  actions: {
    clicked: function(actionName) {
      this.get('model').send(actionName);
    }
  },
});
