if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.prototype.clone) {
  Array.prototype.clone = function() {
    return JSON.parse(JSON.stringify(this));
  };
}

if (!Array.prototype.contains) {
  Array.prototype.contains = function(element) {
    return this.indexOf(element) !== -1;
  };
}