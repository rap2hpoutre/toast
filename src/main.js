import * as ToastGenerator from './toast-generator';

console.log(ToastGenerator.generate());

document.addEventListener('DOMContentLoaded',function() {
  document.getElementById('img-container').appendChild(ToastGenerator.getAsImage());
});