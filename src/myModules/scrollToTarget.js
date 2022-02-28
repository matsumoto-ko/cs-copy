const scrollToTarget = function (targetelemnt) {
  let element = document.getElementById(targetelemnt);
  let y = element.getBoundingClientRect().top;
  scrollTo(0, y);
};

export default scrollToTarget;
