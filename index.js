window.onload = () => {

  //Selecting all elements
  let hour = document.getElementById("hours"), 
  minute = document.getElementById("minutes"), 
  indicator = document.getElementById("indicator"),
  startBtn = document.querySelector("#start-alarm"),
  stopBtn = document.querySelector("#stop-alarm"),
  interval,
  tone = document.querySelector("audio"),
  alarmVal = document.getElementById("time"),
  alertText = document.querySelector("#alertText");
  
  
  
  //Setting the current time function
  function clock(){
    //initializing the current time
    let t = new Date();
    let hours = t.getHours();
    let mins = t.getMinutes();

    //Setting the Post meridiem when the time is after noon
    if (hours>=12) {
      indicator.innerText="PM";
    }
    //Setting the ante meridiem when the time is before noon
    else indicator.innerText="AM";

    //When hour is less than 10, prepend the mumber 0 to it
    if (hours<10){
      hours = `0${hours}`;
    }

    //When minutes is less than 10, prepend the number 0 to it.
    if (mins<10){
      mins = `0${mins}`;
    }

    //I know it's probably shorter to use arithmetic evaluation to get this part of the code but I wanted to try out the switch statement, haven't used it before.
    switch (hours) {
      //Check for the hour value, change the output to it's respecive meridiem value and prepend the number 0 to it.
      case 13: hours="0"+1;break;
      case 14: hours="0"+2;break;
      case 15: hours="0"+3;break;
      case 16: hours="0"+4;break;
      case 17: hours="0"+5;break;
      case 18: hours="0"+6;break;
      case 19: hours="0"+7;break;
      case 20: hours="0"+8;break;
      case 21: hours="0"+9;break;
      case 22: hours=10;break;
      case 23: hours=11;break;
    }

    //assigning the values of hour and minute to elements in the DOM
    hour.innerText=hours;
    minute.innerText=mins;
  }

  //Updating the time values in the DOM by every 1 second
  setInterval(clock,1000);


  //Vibrator logic starts

  //calculate the interval for vibration
  calculateInterval = (initial, vibrateArray) => {
    //get the sum of all numbers in the array
    for (let dur of vibrateArray) initial += dur;
    return initial;
  }

  //declare variables
  let vibrateInterval,
  vibrateArray = [200, 100, 200],
  initial = 300,
  startInterval = calculateInterval(initial, vibrateArray);
  console.log(startInterval);

  // Starts vibration at passed in level
  function startVibrate(duration) {
    navigator.vibrate(duration);
  }

  // Stops vibration
  function stopVibrate() {
    // Clear interval and stop persistent vibrating
    if (vibrateInterval) clearInterval(vibrateInterval);
    navigator.vibrate(0);
  }

  // Start persistent vibration at given duration and interval
  // Assumes a number value is given
  function startPersistentVibrate(duration, interval) {
    vibrateInterval = setInterval(() => {
      startVibrate(duration);
    }, interval);
  }



  //initializing the alarm function
  function checkAlarm() {
    let alarm = alarmVal.value;

    //Getting a part of the time value that represents hour
    let alarmHours = alarm.slice(0,2);
    //Getting a part of the time value that represents minute
    let alarMins = alarm.slice(3,5);
    //Getting a part of the time value that indicates if it's before or after noon
    let alarmAMPM = alarm.slice(6,8);

    //Check if the time is after noon
    if (alarmAMPM == "PM") {
      //when time is after noon, create an instantiation of the hour and add 12 to its value to be able to match the current time value
      alarmHours = parseInt(alarmHours) + 12;
    }
    //Calling another current time value
    let t = new Date();
    let hours = t.getHours();
    let mins = t.getMinutes();

    //Check and play the tone if the created time instance from time value matches the current time
    if (hours == alarmHours && mins == alarMins) {
      tone.play();
    }
  }


  //Starting the alarm
  startBtn.addEventListener("click", ()=>{
    //If the Time value is not empty, then start the alarm
    if (alarmVal.value != undefined) {
      //Getting and showing the alarm alert
      alertText.innerText = "alarm started";
      alertText.style.opacity = 1;
      //Prevent any lurking intervals of time before starting
      clearInterval(interval);
      //Start the checking of the alarm
      interval = setInterval(checkAlarm, 1000);
      //Removing the alarm alert box after shown for some time
      setTimeout(()=>{
        alertText.style.opacity = 0;
      }, 1500);
    }
  });


  //Stoping the alarm check and the alarm
  stopBtn.addEventListener("click", ()=>{
    //Getting and showing the alarm alert
    alertText.innerText = "alarm stopped";
    alertText.style.opacity = 1;
    //Stoping the alarm check and pause the tone
    clearInterval(interval);
    tone.pause();
    tone.currentTime = 0;
    //Removing the alarm alert box after shown for some time
    setTimeout(()=>{
      alertText.style.opacity = 0;
    }, 1500);
  });


  //When user input the desired time, create and hold a storage of that time value
  alarmVal.addEventListener("input", ()=>{
    localStorage.setItem("alarmTime", alarmVal.value);
  });

  //Get and set the created storage value to the input when logged in to site
  if (alarmVal.value != undefined) {
    alarmVal.value = localStorage.getItem("alarmTime");
  }

}