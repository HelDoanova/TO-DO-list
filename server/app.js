const express = require("express");
const app = express();
const morgan = require("morgan");                       //umoznuje nam nechat server stale zapnut� i kdyz prov�d�me zm�ny ... server se vzdy po ulozeni zmen updatuje
                                                        //(nemus�me vyp�nat a zap�nat znovu) a v cmd se n�m i ukazuj� zm�ny
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const tasksRoutes = require("./api/routes/tasks");  //-- -api
const userRoutes = require("./api/routes/user");

const path = require("path")
const publicPath = path.join(__dirname, "..", "client", "build")

//Set up default mongoose connection
//var mongoDB = "mongodb+srv://helena-doanova:letiste1@to-do-list-usjf7.mongodb.net/test?retryWrites=true&w=majority";
var mongoDB = "mongodb+srv://helena-doanova:" + process.env.MONGO_ATLAS_PW + "@to-do-list-usjf7.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//mongoose.connect("mongodb+srv://helena-doanova:" + process.env.MONGO_ATLAS_PW + "@to-do-list-usjf7.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true }); //, {useMongoClient:true}  { useNewUrlParser: true },
//mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));     //podporuje jen jednoduch� body pro data kodovana v URL
app.use(bodyParser.json());     //extrahuje json data a umo�n� d�m je snadn�ji ��st



//p�edch�z�m course errors(jsou to bezpe�nostn� mechanismy ��zen� browserem) toto ochr�n� API p��stup jen v browseru - v p� postman to pujde i tak
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET") //��k�m browseru co m��u poslat
        return res.status(200).json({});
    }
    next();
});

app.use("/tasks", tasksRoutes); //--api
app.use("/user", userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})


//o�et�en� chyb
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(publicPath + "index.html"));
});


//const PORT = process.env.PORT||5000;
//app.listen(PORT, () => {
//    console.log('Listening on port' + PORT)
//})

module.exports = app;