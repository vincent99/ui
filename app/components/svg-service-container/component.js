import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  xCoord: Ember.computed('service.coords', function() {
    return this.get('service.coords')[0];
  }),
  yCoord: Ember.computed('service.coords', function() {
    return this.get('service.coords')[1];
  })
});
