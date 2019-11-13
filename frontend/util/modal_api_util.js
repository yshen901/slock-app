/*  NOTE: USE THESE TO TOGGLE MODALS...DON'T PASS AROUND FUNCTIONS AND STATE
          getELementsByClassName("class1 class2") returns elements with all those classes
*/        
export const toggleElements = (className) => {
  let elements = document.getElementsByClassName(className);
  if (elements)
    for (let i = 0; i < elements.length; i++)
      elements[i].classList.toggle("hidden");
}

export const hideElements = (className) => {
  let elements = document.getElementsByClassName(className);
  if (elements)
    for (let i = 0; i < elements.length; i++)
      elements[i].classList.add("hidden");
}

export const revealElements = (className) => {
  let elements = document.getElementsByClassName(className);
  if (elements)
    for (let i = 0; i < elements.length; i++)
      elements[i].classList.remove("hidden");
}

export const focus = (id) => {
  let element = document.getElementById(id);
  if (element) element.focus();
}