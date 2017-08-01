import React from 'react';
import {render} from 'react-dom';
import SortTable from './SortTable'
require("babel-polyfill");

render((
   <SortTable />
), document.getElementById('root'))
