export const setMenuVisibility = (visible: boolean) => {
  let cMenuModalBar = document.getElementById("cMenuModalBar");
  if (cMenuModalBar) {
    visible == false
      ? (cMenuModalBar.style.visibility = "hidden")
      : (cMenuModalBar.style.visibility = "visible");
  }
};
