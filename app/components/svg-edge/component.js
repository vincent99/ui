import Ember from 'ember';
import SafeStyle from 'ui/mixins/safe-style';

export default Ember.Component.extend(SafeStyle,{
  path: null,

  tagName: 'path',
  attributeBindings: ['draw:d'],
  classNames: ['edge-path'],


  // Markers require the full path in a SPA to work correctly
  safeStyle: `marker-start: url(${window.location.pathname}#markerSquare); marker-end: url(${window.location.pathname}#markerArrow);`,

  draw: Ember.computed('path.{d,m,l}', function() {
    var out;
    var path = this.get('path');

    if ( path.d )
    {
      return path.d;
    }
    else
    {
      out = `M ${path.m[0]} ${path.m[1]}`;
      path.l.forEach((item) => {
        out += ` L ${item[0]} ${item[1]}`;
      });
      return out;
    }
  }),
});
