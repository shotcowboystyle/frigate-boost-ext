import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
  defaults: {
    frigate_instance_domain: '',
  },
  migrations: [OptionsSync.migrations.removeUnused],
  logging: true,
});
