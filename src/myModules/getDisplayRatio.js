const getDisplayRatio = function (targetElement) {
  let mapdiv = document.getElementById(targetElement);

  const width = window.innerWidth;
  const height = window.innerHeight;
  console.log(width);
  if (width < 519) {
    mapdiv.style.width = String(Math.floor(width * 0.9)) + "px";
    mapdiv.style.height = String(Math.floor(height * 0.6)) + "px";
  } else {
    mapdiv.style.width = String(Math.floor(width * 0.5)) + "px";
    mapdiv.style.height = String(Math.floor(height * 0.6)) + "px";
  }
};

export default getDisplayRatio;
