import '@/../styles/simple-weather.scss';

import { moduleSettings, ModuleSettings, SettingKeys, updateModuleSettings } from '@/settings/moduleSettings';
import { VersionUtils } from '@/utils/versionUtils';
import { getGame, isClientGM } from '@/utils/game';
import { log } from './utils/log';
import { initializeLocalizedText } from './weather/climateData';
import { updateWeatherApplication, weatherApplication, WeatherApplication } from './applications/WeatherApplication';

/**
* Register module in Developer Mode module (https://github.com/League-of-Foundry-Developers/foundryvtt-devMode)
* No need to spam the console more than it already is, we hide them between a flag.
*/

// note: for the logs to actually work, you have to activate it in the UI under the config for the developer mode module
Hooks.once('devModeReady', ({ registerPackageDebugFlag: registerPackageDebugFlag }: DevModeApi) => {
  registerPackageDebugFlag('simple-weather', 'boolean');
});

Hooks.once('init', async () => {
  CONFIG.debug.hooks = true;

  // initialize the solo instances of the various classes
  // settings first, so other things can use them
  updateModuleSettings(new ModuleSettings());
  updateWeatherApplication(new WeatherApplication());
});

Hooks.once('ready', () => {
  checkDependencies();
});

Hooks.once('i18nInit', (): void => {
  initializeLocalizedText();
});

Hooks.once(SimpleCalendar.Hooks.Ready, async () => {
  log(false, 'simple-calendar-ready');

  // set the date and time
  if (moduleSettings.get(SettingKeys.dialogDisplay) || isClientGM()) {
    await weatherApplication.updateDateTime(SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp()));   // this is really for the very 1st load; after that this date should match what was saved in settings
  }

  // add the datetime change hook
  Hooks.on(SimpleCalendar.Hooks.DateTimeChange, ({date}: { date: SimpleCalendar.DateData }) => {
    weatherApplication.updateDateTime(date);
  });
});

// on non-GMs, we need to update whenever the GM changes the weather
Hooks.on('updateSetting', (setting: Setting): void => {
  if (setting.key === 'simple-weather.' + SettingKeys.lastWeatherData) 
    weatherApplication.setWeather();
});

// make sure we have a compatible version of simple-calendar installed
function checkDependencies() {
  const minimumVersion = '2.4.0';
  const scVersion = getGame().modules.get('foundryvtt-simple-calendar')?.version;

  if (scVersion && (scVersion===minimumVersion || VersionUtils.isMoreRecent(scVersion, minimumVersion)))
    return;

  ui.notifications?.error('Simple Weather cannot initialize and requires Simple Calendar v2.4.0. Make sure the latest version of Simple Calendar is installed.');
  ui.notifications?.error('Version found: ' + scVersion);
}

