import { Parse } from 'parse';
import { Component } from '@angular/core';
import { ENV } from '../../app/app.constant';
import { Geolocation} from '@capacitor/geolocation';


// Import the wrapper class directly

import { BleClient, numbersToDataView, numberToUUID,   dataViewToText } from '@capacitor-community/bluetooth-le';
const PM25_SERVICE = 'C8D1D262-861F-4082-947E-F383A259AAF3';
const PM25_SERVICE_CHARACTERISTIC = 'B0F332A8-A5AA-4F3F-BB43-F99E7791AE01';





@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
public txtpm25: string;
public datetime_ux: string;

public datetime: Date;

public latitude: number;
public  longitude: number;
public  altitude: number;


  private parseAppId: string = ENV.parseAppId;
  private parseServerUrl: string = ENV.parseServerUrl;
  private parseJSKey: string=ENV.parseJSKey;

public result: string;

public output_json: string;


  constructor() {
 this.parseInitialize();
this.getLocation();  
 this.connect();

  }



  async getLocation()  {
  const position = await Geolocation.getCurrentPosition();
  this.latitude = position.coords.latitude;
  this.longitude = position.coords.longitude;
  this.altitude = position.coords.altitude;
  return position.coords;
}


  private parseInitialize() {
    Parse.initialize(this.parseAppId, this.parseJSKey);
    Parse.serverURL = this.parseServerUrl;

    }


 async  connect(): Promise <void> {

  try {
    await BleClient.initialize();
      const device = await BleClient.requestDevice({
      namePrefix: 'CanAirIO'
 
    });

        console.log('device', device);

   await BleClient.connect(device.deviceId);
    console.log('connected to device', device);
    
  const result = await BleClient.read(device.deviceId, PM25_SERVICE, PM25_SERVICE_CHARACTERISTIC);



   console.log('canair.io result array', dataViewToText(result));



let d = new Date();
this.datetime=d;
var unixTimeStamp = Math.floor(d.getTime() / 1000);
this.datetime_ux=unixTimeStamp.toString();

this.output_json=dataViewToText(result);

this.txtpm25=this.output_json;

var Comment = Parse.Object.extend('canairio_raw_data'); 



    await BleClient.startNotifications(
      device.deviceId,
      PM25_SERVICE, PM25_SERVICE_CHARACTERISTIC,

      (value) => {
var canairio_store = new Comment();

this.txtpm25=dataViewToText(value);

// set initial data record
canairio_store.set('output_json',dataViewToText(value));
canairio_store.set('latitude',this.latitude);
canairio_store.set('longitude',this.longitude);
canairio_store.set('altitude',this.altitude);
canairio_store.set('unix_time',this.datetime_ux);
canairio_store.save();
      }
    );











    setTimeout(async () => {
      await BleClient.stopLEScan();
      console.log('stopped scanning');
    }, 5000);
  } catch (error) {
    console.error(error);
  }


}







}
