import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  grid: [],
  setup: function() {
    this.buildLayout();
  }.on('init'),
  buildLayout: function() {
    this.get('services').forEach((item, index, enumerable) => {
      item.set('coords', [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)]);
    });
  }
});
