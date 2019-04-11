# ESP3D-WEBUI 
 [![Build Status](https://travis-ci.org/luc-github/ESP3D-WEBUI.svg?branch=preactbased)](https://travis-ci.org/luc-github/ESP3D-WEBUI)   
 Test code for WebUI using Preact per @aganov suggestion
 
 This is mainly a backbone and learning process repository, so do not use it, a new branch will be created when usable.
 
### Setup

1 - Install current nodejs LTS (currently v10.15.3)
2 - Download all necessary packages
```
npm install
```

### Start dev server    
http://localhost:8080

```
npm run start
```

### Build index.html to /dist folder

```
npm run build
```

### Code beautify with prettier
use pluggin or cli   

```
npm i -G prettier
```

the config file is .prettierrc  
a batch is available if you need : prettyfiles.bat, it is just automating the following commands:  
prettier --config .prettierrc --write "{src/**/,webpack/**/}*.js"
prettier --config .prettierrc --write src/**/*.html"

