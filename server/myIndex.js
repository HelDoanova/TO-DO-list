//co potrebuju app + server
const express = require("express");
const app = express();
const morgan = require("morgan");                       
const bodyParser = require("body-parser");              
const mongoose = require("mongoose");
const cors = require('cors');       
const jwt = require('jsonwebtoken');      
const bcrypt = require('bcrypt');
//const xss = require('xss');    
//const xss2 = require('sanitize');  
const sanitizer = require('sanitizer');
const cookieParser = require("cookie-parser")
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use(cors());   
app.use(bodyParser.urlencoded({ extended: false }));     //podporuje jen jednoduché body pro data kodovana v URL
app.use(bodyParser.json());     //extrahuje json data a umožní dom je snadněji post

//app.use(require('sanitize'.middleware));
//server
app.use(express.json());
const PORT = process.env.PORT || 5000;



//DB connection 
mongoose.connect("mongodb+srv://helena-doanova:" + process.env.MONGO_ATLAS_PW + "@to-do-list-usjf7.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true }) //, {useMongoClient:true}  { useNewUrlParser: true },
    .then(() => console.log("Connected to MongoDB!"))
    .catch(error => console.error("Could not connect to MongoDB... ", error));


// Mongoose schemas ------------------------------------------------------
const taskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskName: { type: String, required: true },
    complete: { type: Boolean, default: false, required: false }   //neni vyžadováno při POST
});

const Task = mongoose.model("Task", taskSchema);

const userSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId, 
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
    password: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

//Authorization-------------------------------------
/*
const Auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};*/
// GET requests ----------------------------------------------------------------
//all

app.get('/api/tasks', (req, res) => {
    Task.find()                     //bez argumentu mi to vyhledá všechny prvky
        .select(req.query.select)           //metoda pro definici polí, které chceme vybrat
        .exec()
        .then(task => {
            res.json(task)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//----find task
async function getTaskByID(id) {
    let task = await Task.findById(id);
    console.log(task);
    if (task) {
        task = task.toJSON();
    }
    return task;
}

app.get('/api/tasks/:id', (req, res) => {
    
    getTaskByID(req.params.id)
    //.select('taskName complete _id')
    //.exec()
    .then(task => {
        if (!task) {                            
            return res.status(404).json({
                message: "Task not found"
            });
        }
        console.log("From database", task);
        if (task) {
            res.send(task);
        } else {
            res.status(404).json({ message: 'No valid entry found for provided ID' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

// POST requests -------------------------------------------------------------	
app.post('/api/tasks', (req, res) => {
    const task = new Task({
        _id: new mongoose.Types.ObjectId,
        taskName: sanitizer.sanitize(req.body.taskName),
        complete: sanitizer.sanitize(req.body.complete)       
    });
    task.save()
        .then(result => {
        if (!task) {                            
            return res.status(404).json({
                message: "Task not found"       
            });
        }
        console.log(result);
        res.status(201).json(result);              //201-vse bylo vytvoreno spravne 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// PUT requests ----------------------------------------------------------------
app.put('/api/tasks/:id', (req, res) => {
    const id = sanitizer.sanitize(req.params.id);
    
    Task.updateOne({ _id: id }, req.body, { new: true }) 
        .exec()
        .then(result => {
            res.json(result);
            res.status(200).json({
                mssage: 'Task updated'
            });
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// DELETE requsets ------------------------------------------------------------------
app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    Task.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Task deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//----------------------------------------------------------------------------------------------


//POST-login
app.post('/api/login', (req, res) => {
    User.find({ email:  sanitizer.sanitize(req.body.email) })                //lock the user in
    .exec()
    .then(user => {                                 //user array
        if (user.length < 1) {                      //zadny user
            return res.status(401).json({           //1.overeni
                message: "Authorization failed"
            });
        }                                           //user = [0], jediny user ktery se nasel
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {                                   //overeni - bud spatne heslo nebo email
                return res.status(401).json({
                    message: "Authorization failed"
                });
            }
            if (result) {
                const token = jwt.sign({    //sign(payload,secretOrPrivateKey,[options,callback])
                    email:  user[0].email,   //payload= co vse chceme pustit ke kientovi
                    userId: user[0]._id
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"             //token bude platny jen 1 hodinu --kvuli zabezpeceni
                    }
                );
                res.cookie('loggedIn',true);
                return res.status(200).json({
                    message: "Authorization successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "Authorization failed"
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

//POST - signup

app.post('/api/register', (req, res) => {
    User.find({ email: req.body.email })        //zajistujeme ze se nevytvori user s jiz existujici email adresou
        .exec()
        .then(user => {
            if (user.length >= 1) {                 //existuje   
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {                                                    //user.length = 0 ---> neexistuje -> vytv���m ho
                bcrypt.hash(req.body.password, 10, (err, hash) => {     //hashuju heslo aby nebylo videt v databazi
                    if (err) {                                          // + pridavam za nej random string aby nemohlo byt desifrovano
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            //_id: new mongoose.Types.ObjectId,
                            email: sanitizer.sanitize(req.body.email),
                            password:  sanitizer.sanitize(hash)
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.cookie('loggedIn',true);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});


const path = require("path")
const publicPath = path.join(__dirname, "..", "client", "build")
app.use(express.static(publicPath))

app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.listen(PORT, () => console.log('Listening on port ${PORT}...'));


/*
//DELETE
app.delete('/api/users/:id', (req, res) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(resuslt => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});*/

