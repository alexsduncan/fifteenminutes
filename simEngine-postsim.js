function decreaseCounter() {
  timeWeHaveLeft--;
  document.getElementById("timeoutInfoForThisQuestion").innerHTML =
                                      timeWeHaveLeft + " sec remaining...";
  if(timeWeHaveLeft > 0) {
    countdownID = window.setTimeout(decreaseCounter, 1000);
  }
}

var simSeriesEndingStarted;
function beginSimSeries() {
  simSeriesEndingStarted = false;
  SimTextSet = SimTextSet_BeginningSeries;
}

function updateSimText()
{
  if(timeStep == 0) {
    initSimVars();
    beginSimSeries();
  }

  SimTextSet[timeStep].simVarsEffectsFunc();
  boundSimVars();
  updateDebugOutput();

    document.getElementById("currentSimState").innerHTML= 
                    SimTextSet[timeStep].textFunc() +
                    simSpecificOutput();
                    
    document.getElementById("controlsForThisStep").innerHTML= "";
    
    for(var i=0; i<SimTextSet[timeStep].buttonTypes.length; i++) {
      if( SimTextSet[timeStep].buttonTypes[i].showUpIfFunc() ) {
        document.getElementById("controlsForThisStep").innerHTML += 
                "<button type='button' "+
"onclick='advanceSim(SimTextSet[timeStep].buttonTypes["+i+"].effectsArray)'>"+
          SimTextSet[timeStep].buttonTypes[i].label+"</button>";
        } // end of if
    } // end of for
    
    if(timeoutID != -1) {
      countdownID = window.setTimeout(decreaseCounter, 1000);
      document.getElementById("timeoutInfoForThisQuestion").innerHTML =
          "<b>HURRY! THIS IS A TIMED REPONSE!</b>";
    } else {
      document.getElementById("timeoutInfoForThisQuestion").innerHTML =
          "";
    }
    
} // end of function

function afterPageLoads() {
  updateSimText();
}

var timeStep = 0;

function advanceSim(effectsList)
{
  if(timeoutID != -1) {
    window.clearInterval(timeoutID);
    timeoutID = -1;
  }
  if(countdownID != -1) {
    window.clearInterval(countdownID);
    countdownID = -1;
  }

  for(var i=0;i<effectsList.length;i++) {
    effectsList[i].doEffect();
  }
  
  do {
    timeStep++;
  } while( timeStep < SimTextSet.length && SimTextSet[timeStep].showUpIfFunc() == false );
  
  if(timeStep >= SimTextSet.length) {
  
    if(simSeriesEndingStarted) {
      timeStep = 0;
      simValues = {};
      alert("Play again?");
    } else if(endSeriesIfConditionsMet() == null) {
      SimTextSet = SimTextSet.concat( nextMiddleSeries() );
    } else {
      SimTextSet = SimTextSet.concat( endSeriesIfConditionsMet() );
      simSeriesEndingStarted = true;
    }
    
  }
  updateSimText();  
}