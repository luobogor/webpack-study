import printMe from './print.js';
import './style.css'

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = 'Hello World';

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
}

document.body.appendChild(component());

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode !');
}
