import http from 'http';
import net from 'net';

const origListen = net.Server.prototype.listen;
let serverRef = null;
net.Server.prototype.listen = function(...args) {
  console.log('TRACE: listen called');
  serverRef = this;
  const result = origListen.apply(this, args);
  console.log('TRACE: listen returned, listening=', this.listening);
  return result;
};

const origLog = console.log;
console.log = function(...args) {
  origLog.apply(console, args);
  const msg = args.join(' ');
  if (msg.includes('Server running')) {
    if (serverRef) {
      console.log('TRACE: After callback, listening=', serverRef.listening);
      console.log('TRACE: active handles count:', process._getActiveHandles().length);
      console.log('TRACE: active handles:', process._getActiveHandles().map(h => h.constructor?.name || h));
    }
  }
};

const origExit = process.exit;
process.exit = function(code) {
  console.log('TRACE: process.exit called with code', code);
  console.trace();
  return origExit.call(process, code);
};

await import('./index.js');
