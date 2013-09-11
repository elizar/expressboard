## Description

Express board is just a simple message board platform powered by [**node.js**](http://nodejs.org) and [**express**](http://expressjs.com/) web framework. It's pretty simple and no fancy ajax call, just pure page by page request and response. 

The only `javascript` file included is Typekit's font loader.

### Dependencies

- **Express** -  Web framework
- **Jade** - Templating Engine
- **Mongoose** - Object Document Mapper
- **Passport** - Handles authentication
- **Connect-Flash** - Handles flash messaging for form submission


### Setup

- **Install MongoDB**
  - ` $ brew install mongodb ` on **Mac**
  - ` $ sudo apt-get install mongodb ` on **Ubuntu**
  - ` $ sudo pacman -S mongodb ` on **ArchLinux**, or you do the ` $ yaourt ` thing.

- **Download and Run** 
  - ` $ git clone https://github.com/elizar/expressboard.git && cd expressboard ` will download the app, and cd to the folder once done.
  - ` $ mongod & ` to run mongodb daemon on the background
  - ` $ npm install ` should download and install all the dependencies
  - Now do ` $ node app.js ` to start the http server, and  then go ahead and visit this url in your browser ` http://localhost:3000 `

### Credits

- Code [ me ](http://github.com/elizar)
- UI [ me ](http://github.com/elizar)


### License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 [ Elizar Pepino ](http://elizarpepino.com/)