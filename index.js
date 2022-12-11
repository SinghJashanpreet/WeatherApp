//https://api.openweathermap.org/data/2.5/weather?q=Patiala&appid=3c61e5586ff2eeb04575bbaf7c13863e

const http = require('http');
const fs = require('fs');
var requests = require('requests');
const { on } = require('events');

const homeFile = fs.readFileSync('index.html',"utf-8");

const ReplaceVal = (temVal,originalVal)=>{
let newFile = temVal.replace("{%temval%}",(originalVal.main.temp).toFixed(1));
newFile = newFile.replace("{%temmin%}",originalVal.main.temp_min );
newFile = newFile.replace("{%temmax%}",originalVal.main.temp_max);
newFile = newFile.replace("{%location%}",originalVal.name);
newFile = newFile.replace("{%country%}",originalVal.sys.country);
newFile = newFile.replace("{%status%}",originalVal.weather[0].main);

return newFile;
};
const server = http.createServer((req,res)=>{
    if(req.url == '/')
    {
        requests("https://api.openweathermap.org/data/2.5/weather?lat=30.3747&lon=76.1486&units=metric&appid=3c61e5586ff2eeb04575bbaf7c13863e")
            .on("data",(chunk)=>{
            var obj = JSON.parse(chunk);
            var arrObj = [obj];
            
            const realTimeData = arrObj.map((val)=>ReplaceVal(homeFile,val))
            .join("");
            //console.log(realTimeData);

         res.write(realTimeData);
                
            
        })
        .on("end",(err)=>{
            if(err)
            console.log("Some Errror occured = " , err);
            res.end();
        });
    }
});

server.listen(8000,'127.0.0.2');
