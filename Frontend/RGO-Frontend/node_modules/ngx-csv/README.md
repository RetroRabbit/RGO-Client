![angularjs_logo](https://user-images.githubusercontent.com/4659608/37036392-9bf53686-2160-11e8-95fc-bbab638d7d60.png)

# ngx-csv | Export to CSV  in ngx


[![npm version](https://badge.fury.io/js/ngx-csv.svg)](https://badge.fury.io/js/ngx-csv)
![Angular](https://img.shields.io/badge/Angular-%3E%3D2.0-red.svg)
![npm](https://img.shields.io/npm/dm/ngx-csv.svg)

> Helper library for create CSV file in Angular2+
> 

## Installation 

```javascript
npm install --save ngx-csv
```

## Example 
```javascript

import { ngxCsv } from 'ngx-csv/ngx-csv';

var data = [
  {
    name: "Test 1",
    age: 13,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 2',
    age: 11,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 4',
    age: 10,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
];

new ngxCsv(data, 'My Report');

```

## API | **ngxCsv(data, filename, options)**


| Option        | Default           | Description  |
| :------------- |:-------------:| -----|
| **fieldSeparator**      | , | Defines the field separator character |
| **quoteStrings**      | "      | If provided, will use this characters to "escape" fields, otherwise will use double quotes as deafult |
| **decimalseparator** | .      | Defines the decimal separator character (default is .). If set to "locale", it uses the [language sensitive representation of the number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).|
| **showLabels** | false      | If provided, would use this attribute to create a header row |
| **showTitle** | false      |   |
| **useBom** | true      | If true, adds a BOM character at the start of the CSV |
| **noDownload** | false      | If true, disables automatic download and returns only formatted CSV |


## Options Example

```javascript
  var options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'Your title',
    useBom: true,
    noDownload: true,
    headers: ["First Name", "Last Name", "ID"]
  };

  ngxCsv(data, filename, options);

```

## Credits



 * [sn123](https://github.com/sn123)
 * [arf1980](https://github.com/arf1980)
 * [lhanscom](https://github.com/lhanscom)