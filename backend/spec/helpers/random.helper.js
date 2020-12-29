/* eslint-disable prefer-arrow/prefer-arrow-functions */
module.exports = {
  randomString(len) {
    // eslint-disable-next-line no-bitwise
    return [...Array(len)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
  },
  randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  },
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + parseInt(min, 10);
  }
};
