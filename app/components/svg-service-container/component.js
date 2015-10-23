import Ember from 'ember';

export default Ember.Component.extend({
  node: null,


  tagName: 'g',
  attributeBindings: ['transform'],

  width: 235,
  height: 66,

  transform: Ember.computed('node.{x,y}', function() {
    return `translate(${this.get('node.x')},${this.get('node.y')})`;
  }),
});
