export const setMenuVisibility = (visible: boolean) => {
  let cMenuModalBar = document.getElementById("cMenuModalBar");
  if (cMenuModalBar) {
    visible == false
      ? (cMenuModalBar.style.visibility = "hidden")
      : (cMenuModalBar.style.visibility = "visible");
  }
};

export const setBottomValue = (
  cMenuBottomValue: number,
  cMenuNumRows: number
) => {
  let cMenuModalBar = document.getElementById("cMenuModalBar");
  if (cMenuModalBar) {
    cMenuModalBar.setAttribute(
      "style",
      `left: calc(50% - calc(${
        cMenuModalBar.offsetWidth
      }px / 2)); bottom: ${cMenuBottomValue}em; grid-template-columns: ${"1fr ".repeat(
        cMenuNumRows
      )}`
    );
  }
};
