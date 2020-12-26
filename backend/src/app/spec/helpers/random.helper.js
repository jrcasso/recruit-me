module.exports = {
    randomString: function(len) {
        return [...Array(len)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    },
    randomColor: function() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    },
    randomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}