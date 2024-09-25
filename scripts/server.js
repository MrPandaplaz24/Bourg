//register curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}'
//login curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}'

/**
 * Very very very fucking simple server
 * takes input from user ({email, password})
 * can register and login user
 * 
 * 
 * 
 * 
 */




const { createServer } = require('http');
const { resolve } = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const users = []; // stores as { email, password }

const getRequestData = (req) => { //getRequestData takes a single parameter 'req' which is a request object that node.js provides in a http server. req contains information about the incoming http request such as its headers url method and importnaatly the body for the post request
    return new Promise((resolve, reject) => { // if the promise is fulfilled it will call the resovel function else it will call the reject function
        let body = ''; // creates a varible body let makes it only accessable inside the promise
        
        //Syntax Dispatcher.on(eventName: 'error) 
        
        req.on('data', chunk => { //an event handler that listen for data events on the request object
            body += chunk.toString();
        });
        req.on('end', () => { // an event handler that listen for the end event on the request object
            // the end event is triggered when the request body is fully received
            resolve(JSON.parse(body)); // the resovel function will be called when the promise is fulfilled
        });
        req.on('error', (err) => { //triggeres when error event is called aka something goes wrong
            reject(err); // handles the error
        });
    });
};



const server = createServer((req, res) => {

    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/plain');
    //res.end('Hello World');
    console.log('Received registration request:', req.method, req.url);

    if(req.url === '/register' && req.method === 'POST'){
        getRequestData(req)
        .then(({email, password}) => {
            console.log(({email, password}));
            //Validate input
            if(!email || !password){
                res.writeHead(400, { 'Content-Type': 'text/plain'});
                return res.end('Email and password are required');
            }

            console.log("Validated input")

            //Check if the user is already in the database (Array users [] )
            const userExists = users.some(user => user.email === email);
            if(userExists){
                res.writeHead(400, { 'Content-Type': 'text/plain'}); //HTTP 400 BAD REQUEST
                return res.end('User already exist');
            }

            console.log("Username is avalible!");

            // Add user to the database (Array users []) 
            users.push({email, password});
            console.log('users pushed into database')
            res.writeHead(201, { 'Content-Type': 'text/plain' } ) //HTTP CODE 201 CREATED
            return res.end('User register successfully');
        })
        .catch(() => {
            res.writeHead('500', {'Content-Type': 'text/plain'}); // HTTPS CODE 500 INTERNAL SERVER ERROR
           
            res.end('Server Error');
        });
    } else if (req.url === '/login' && req.method === 'POST'){
        getRequestData(req).then(({email,password}) => {
            // Validate input
            if (!email || !password) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Email and password are required');
            }

            //find user
            const user = users.find(user => user.email === email);
            if(!user){
                res.writeHead(400, {'Content-Type': 'text/plain'});
                return res.end('User not found');
            }

            //Checks password
            if(user.password !== password){
                res.writeHead(400, {'Content-Type': 'text/plain'});
                return res.end('Incorrect Password');
            }

            res.writeHead(500, {'Content-Type': 'text/plain'});
            return res.end('logged in succesfully');
        })
        .catch(() => {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Server error');
        });
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('ERROR 404 Page not found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

