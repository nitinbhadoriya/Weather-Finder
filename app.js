//jshint esversion:6
const express=require("express");
const app=express();
const http=require("https");
const bodyParser=require("body-parser");
app.set('view engine','ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.render("home");
  // res.sendFile(__dirname+"/index.html");
});
app.post("/",function(req,res){
    if(req.body.button==="reload"){
      res.redirect("/");
    }
  const cname=req.body.cname;

  url="https://api.openweathermap.org/data/2.5/weather?q="+cname+"&appid=ee101339e2b74ebe9ac543ecbe652793&units=metric";
  http.get(url,function(response){
    response.on("data",function(data){
      const weather=JSON.parse(data);
      const code=weather.cod;
      // console.log(code);
      if(code==200){
        const temp=weather.main.temp;
        const icon=weather.weather[0].icon;
        const des=weather.weather[0].description;
        const url= "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        res.render("success",{
          image:url,
          des:des,
          cityname:cname,
          deg:temp
        });
        // res.write('<head><meta charset="utf-8"></head>');
        // res.write("<img src="+url+"> ");
        // res.write("<h1>The weather is currently "+weather.weather[0].description+"<h1>");
        // res.write("<h1>The temperature in "+cname+" is "+temp+"</h1>");
        // res.send();
      }
      else{
        res.render("failure",{cityname:cname});
      }
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(req){
  console.log("Server Started");
});
