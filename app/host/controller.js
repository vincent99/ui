import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import ContainerSparkStats from 'ui/mixins/container-spark-stats';

export default Controller.extend(ContainerSparkStats, {
  host:        alias('model.host'),
  queryParams: ['sortBy'],
  sortBy:      'name',

  portHeaders:  [
    {
      name:           'ip',
      sort:           ['ipAddress','port'],
      translationKey: 'hostsPage.hostPage.portsTab.table.header.ip',
    },
    {
      name:           'port',
      sort:           ['port','ipAddress','instanceId'],
      translationKey: 'hostsPage.hostPage.portsTab.table.header.port',
    },
    {
      name:           'service',
      sort:           ['service.displayName','port','ipAddress'],
      translationKey: 'hostsPage.hostPage.portsTab.table.header.service',
    },
    {
      name:           'container',
      sort:           ['instance.displayName','port','ipAddress'],
      translationKey: 'hostsPage.hostPage.portsTab.table.header.container',
    },
  ],
  statsSocket: null,
});
