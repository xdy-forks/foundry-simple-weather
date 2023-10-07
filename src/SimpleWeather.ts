import { WeatherApplication } from '@/applications/WeatherApplication';
import { ModuleSettings } from '@/settings/module-settings';
import { log } from '@/utils/log';
import { isClientGM } from '@/utils/game';


// /**
//  * The base class of the module.  Needed to enable control from the console or other applications (vs. putting all functionality in main.ts)
//  */
export class SimpleWeather {
  private moduleSettings: ModuleSettings;
  private weatherApplication: WeatherApplication;

  constructor(moduleSettings: ModuleSettings) {
    this.moduleSettings = moduleSettings;

    log(false, 'SimpleWeather created');
  }

  // call after SimpleCalendar has been loaded ('simple-calendar-ready') hook
  public async onReady(): Promise<void> {
    await this.initializeWeatherData();
    this.initializeWeatherApplication();
  }

  // called in response to calendar changing date
  public onDateTimeChange(currentDate: SimpleCalendar.DateData) {
    // //let newWeatherData = this.mergePreviousDateTimeWithNewOne(currentDate);

    // if (this.hasDateChanged(currentDate)) {
    //   log(false, 'DateTime has changed');

    //   if (isClientGM()) {
    //     log(false, 'Generate new weather');
    //     //newWeatherData = this.weatherGenerator.generate();
    //   }
    // }

    // if (isClientGM()) {
    //   //this.weatherGenerator.setWeatherData(newWeatherData);
    // }

    // if (this.moduleSettings.getDialogDisplay() || isClientGM()) {
    //   log(false, 'Update weather display');
    //   this.updateWeatherDisplay(currentDate);
    // }
  }

  // public resetWindowPosition() {
  //   if (this.moduleSettings.getDialogDisplay() || isClientGM()) {
  //     this.weatherApplication.resetPosition();
  //   }
  // }

  private async initializeWeatherData() {
    const weatherData = this.moduleSettings.getLastWeatherData();

    log(false, 'loaded weatherData:' + JSON.stringify(weatherData));
  
    // if (weatherData) {
    //   log(false, 'Using saved weather data');
    //   this.weatherTracker.setWeatherData(weatherData);
    // } else if (isClientGM()) {
    //   log(false, 'No saved weather data - Generating weather');
  
    //   // NOTE: This is where you'll need to start mid-season, for example
    //   // more generally... if we saved the prior day, we should generate weather based on that day 
    //   // otherwise, we should generate weather starting at a random spot based on the season
    //   weatherData.currentDate = SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp());
    //   this.weatherTracker.setWeatherData(weatherData);
    //   weatherData = this.weatherTracker.generate(Climates.temperate);
    //   await this.settings.setWeatherData(weatherData);
    // }
  }

  private initializeWeatherApplication() {
    if (this.moduleSettings.getDialogDisplay() || isClientGM()) {
      this.weatherApplication = new WeatherApplication(
        this.moduleSettings,
        () => {
          // this will be called when the application is done with the initial render
          log(false, 'RENDER COMPLETE!');
          // const weatherData = this.settings.getWeatherData();
          // weatherData.currentDate = SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp());
          // this.weatherApplication.updateDateTime(weatherData.currentDate);
          // this.weatherApplication.updateWeather(weatherData);
        });
    }
  }

  // private hasDateChanged(currentDate: SimpleCalendar.DateData): boolean {
  //   // const previous = this.weatherGenerator.getWeatherData().currentDate;

  //   // if (this.isDateTimeValid(currentDate)) {
  //   //   if (currentDate.day !== previous.day
  //   //     || currentDate.month !== previous.month
  //   //     || currentDate.year !== previous.year) {
  //   //     return true;
  //   //   }
  //   // }

  //   return true;
  // }

  // private isDateTimeValid(date: SimpleCalendar.DateData): boolean {
  //   if (this.isDefined(date.second) && this.isDefined(date.minute) && this.isDefined(date.day) &&
  //   this.isDefined(date.month) && this.isDefined(date.year)) {
  //     return true;
  //   }

  //   return false;
  // }

  // private isDefined(value: unknown) {
  //   return value !== undefined && value !== null;
  // }

  // private updateWeatherDisplay(dateTime: SimpleCalendar.DateData) {
  //   // this.weatherApplication.updateDateTime(dateTime);
  //   // this.weatherApplication.updateWeather(this.weatherGenerator.getWeatherData());
  // }
}