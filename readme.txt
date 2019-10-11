-------------------------
Running the DEV server...
-------------------------
$npm run start 
 --or--
$ng serve --port 4201 --watch

------------
To deploy...
------------
(1) In project folder, run...
    $ng build  /* places all that you need into ./dist/poke-shop */
    
(2) Then run a web server pointed at ./dist/poke-shop/index.html
    e.g., if you do 
           npm install --global http-server
    You can cd to ./dist/poke-shop, and run 
    $http-server

-----------------------------
Components we've generated...
-----------------------------
ng generate component menu-item  
ng generate component cart-item  

