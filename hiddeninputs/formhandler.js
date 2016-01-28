var r; // return zone
var f; // form
var inputs; // inputs

function returnValues(verb) {
  for(var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked === true) {
      r.innerHTML = 'You ' + verb + ' ' + inputs[i].value;
      
    }
  }
}

function addBehaviours() {
  f = document.getElementsByTagName('form')[0];
  r = document.getElementById('return');
  inputs = f.getElementsByTagName('input');
  
  // behaviours
  for(var i = 0; i < inputs.length; i++) {
    inputs[i].onchange = function() {
      returnValues('clicked');
    };
  }
  f.onsubmit = function() {
    returnValues('submitted');
    return false;
  }
}

window.onload = addBehaviours;