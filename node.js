import http from "http";
import fs from "fs";

const home = fs.readFileSync("./index.html" )
// , ()=>{
//     console.log("I am the home Page.");
//     window.write("Ahmad Humble");
// });

// console.log(home);


const server = http.createServer((req,res)=>{

    if (req.url === "/home")
        // fs.readFile("./index.html" , (err , data)=>{
        //     res.end(data);
        // });
        res.end(home);
        
    else if (req.url === "/about")
        res.end("<h1>About Page</h1>");
    
    else if (req.url === "/contact")
        res.end("<h1>Contact Page</h1>");

    else 
        res.end("<h1>Soory! No page has been found Page</h1>");
    
})

const port = 1000;
server.listen(port,()=>{
    console.log("Server is working")
});