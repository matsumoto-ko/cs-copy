const sanitaizeMethod = function (string) {
  //エスケープ処理
  return string
    .replace(/&/g, "&lt;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

export default sanitaizeMethod;
