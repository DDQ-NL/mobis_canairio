import { Component } from '@angular/core';
// Import the wrapper class directly

import { BleClient, numbersToDataView, numberToUUID,   dataViewToText } from '@capacitor-community/bluetooth-le';


const DEVICE_ID = 'D9629801-932B-8B40-C755-525FD29B5600'
const PM25_SERVICE = 'C8D1D262-861F-4082-947E-F383A259AAF3';
const PM25_SERVICE_CHARACTERISTIC = 'B0F332A8-A5AA-4F3F-BB43-F99E7791AE01';





export async function scan(): Promise<void> {
  try {
    await BleClient.initialize();

  


        const device = await BleClient.requestDevice({
      namePrefix: 'CanAirIO'
 
    });

        console.log('device', device);

   await BleClient.connect(device.deviceId);
    console.log('connected to device', device);
    
        const result = await BleClient.read(device.deviceId, PM25_SERVICE, PM25_SERVICE_CHARACTERISTIC);

//    console.log('canair.io result array', dataViewToText(result));


/*
    await BleClient.startNotifications(
      device.deviceId,
      PM25_SERVICE,
      PM25_SERVICE_CHARACTERISTIC,
      (value) => {

        console.log ('dataview to text' ,dataViewToText(value));

      }
    );
*/





    setTimeout(async () => {
      await BleClient.stopLEScan();
      console.log('stopped scanning');
    }, 5000);
  } catch (error) {
    console.error(error);
  }
}



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
public txtpm25: string;


  constructor() {





this.txtpm25="aew";


scan();




  }

}
