/*  NOTE: USE THESE TO TOGGLE MODALS...DON'T PASS AROUND FUNCTIONS AND STATE
          getELementsByClassName("class1 class2") returns elements with all those classes
*/        
export const toggleElement = (className) => {
  let element = document.getElementsByClassName(className)[0];
  element.classList.toggle("hidden");
}

export const hideElement = (className) => {
  let element = document.getElementsByClassName(className)[0];
  element.classList.add("hidden");
}

export const revealElement = (className) => {
  let element = document.getElementsByClassName(className)[0];
  element.classList.remove("hidden");
}