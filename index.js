/** 
 * __main__
 */
const Bot = require('./src/bot');
const Runner = require('./src/runner');

const io = new Runner(new Bot('bixie'));

io.init();