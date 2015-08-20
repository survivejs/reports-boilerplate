import 'purecss';
import './main.css';

import React from 'react';
import App from './app.jsx';

main();

function main() {
  var app = document.createElement('div');
  document.body.appendChild(app);

  React.render(<App />, app);
}
