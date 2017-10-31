import EmberObject from '@ember/object';
import { hash, all } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model: function(params) {
    var store = this.get('store');

    return store.findAll('host').then((hosts) => {

      return hash({
        host:     store.find('host', params.host_id),
        service:  store.findAll('service'),
        instance: store.findAll('instance'),
      }).then((hash) => {
        return Ember.Object.create({
          all:          all,
          host:         hash.host,
        });
      });
    });
  },
});
