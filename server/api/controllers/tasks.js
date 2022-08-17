 const mongoose = require("mongoose");
 const Joi = require('joi');

const Task = require("../models/task");

function validateTask(task, required = true)
	{
		const schema = {
			taskName:       Joi.string().min(3),
			complete:   	Joi.bool(),
		};

		return Joi.validate(task, schema, { presence: (required) ? "required" : "optional" });
    }
    

exports.tasks_get_all = (req, res, next) => {   
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
        }
    /*                                                                
    Task.find()                     //bez argumentu mi to vyhled� v�echny prvky
        .select("name complete _id")           //metoda pro definici pol�, kter� chceme vybrat
        //.populate('task', 'name') --nepotrebujem asi takze vymazat ! video9
        .exec()
        .then(docs => {
            const response = {  //tvorim objekt response, tak aby na v�stupu bylo to co chci zobrazit
                count: docs.length,     //mno�stv� dat 
                tasks: docs.map(doc => {        //�ada v�ech produkt�
                    return {
                        name: doc.name,
                        complete: doc.complete,
                        _id: doc._id
                        //request: {
                        //    type: 'GET',
                        //    url: 'http://localhost:3000/tasks/' + doc._id    //url na konkretni task
                        //}
                    };
                })
            };
            //if (docs.length >= 0) {
            res.status(200).json(response);
            //} else {
            //    res.status(404).json({
            //        message: 'No entries found' //Zadn� �koly nem�
            //    });
            //}
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        */

//POST
/*
exports.getTaskByID(id) {
    let task = await Task.findById(id);
    console.log(task);
    if (task) {
        task = task.toJSON();
    }
    return task;
};*/


exports.tasks_create_task = (req, res, next) => {   
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

    
    /*const task = new Task({
        _id: new mongoose.Types.ObjectId,
        taskName: req.body.taskName,
        complete: req.body.complete       //zde napevno vlo�eno false = kdyz se tvori novy task jako vychozi complete bude nastaveno false
        //complete: req.body.complete
    });
    task
        .save()
        .then(result => {
            //if (!task) {                            //nevim jestli se to sem hod� --video8 -16 min
            //    return res.status(404).json({
            //        message: "Task not found"       
            //    });
            //}

            console.log(result);
            res.status(201).json({              //201-vse bylo vytvoreno spravne
                message: 'Task was created successflly',
                createdTask: {
                    taskName: result.taskName,
                    complete: result.complete,
                    _id: result._id
                    //request: {
                    //    type: 'GET',
                    //    url: 'http://localhost:3000/tasks/' + result._id
                    //}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });*/
}


exports.getTaskByID(id)
{
    console.log(id);
    let task = await Task.findById(id);
    console.log(task);
    if (task)
    {
        task = task.toJSON();
    }
    return task;
}


//GET
exports.tasks_get_task = (req, res, next) => {        
    
    getTaskByID(req.params.id)
			.then(task => { 
				if (task){
                    res.send(task); 
                }
				else {
                    res.status(404).send("Ukol s daným id nebyl nalezen!");
                }
			})
			.catch(err => { res.status(400).send("Chyba požadavku GET na ukol!") });
	}


    
    /*
    const id = req.params.taskId;
    Task.findById(id)
        .select('taskName complete _id')
        .exec()
        .then(doc => {
            if (!doc) {                            //nevim jestli se to sem hod� --video8 -21 min
                return res.status(404).json({
                    message: "Task not found"
                });
            }
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    task: doc
                    //request: {
                    //    type: 'GET',
                    //    //description: 'Get all tasks',
                    //    url: 'http://localhost:3000/tasks'
                    //}
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });*/
        

//DELETE
exports.tasks_delete_task = async(req, res, next) => {                 
    const id = req.params.taskId;
    Task.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Task deleted'
                //request: {
                //    type: 'POST',
                //    url: 'http://localhost:3000/tasks',
                //    body: { name: 'String' }
                //}
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


//PATCH
exports.tasks_update_task = async (req, res, next) => {
    const { error } = validateTask(req.body, false);
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			Task.findByIdAndUpdate(req.params.id, req.body, { new: true } )
			.then(result => { res.json(result) })
			.catch(err => { res.send("Změna se neprovedla") });
		}
}



    //const id = req.params.taskId;
    //const updateOps = {};
    //for (const ops of req.body) {                   //cyklus pro to abych mohla mn�nit v�ce hodnot ne jen jednu
    //    updateOps[ops.propName] = ops.value;
    //}

    //Task.update({ _id: id }, { $set: updateOps })
    //    .exec()
    //    .then(result => {
    //        res.status(200).json({
    //            mssage: 'Task updated'
    //        });
    //    })
    //    .catch(err => {
    //        console.log(err);
    //        res.status(500).json({
    //            error: err
    //        });
    //    });


//    const updates = Object.keys(req.body)
//    const allowedUpdates = ["name", "complete"]
//    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//    if (!isValidOperation) {
//        return res.status(400).send({ error: "Neplatn� �pravy!" })
//    }
//    try {
//        const task = await Task.findOne({ _id: req.params.id})

//        if (!task) {
//            return res.status(404).send()
//        }

//    updates.forEach((update) => task[update] = req.body[update])
//    await task.save()
//    res.send(task)
//} catch (e) {
//    res.status(400).send(e)
//}
//}

 ////const { error } = validateMovie(req.body, false);
    ////if (error) {
    ////    res.status(400).send(error.details[0].message);
    ////} else {
    //Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    //    .then(result => {
    //        res.json(result);
    //        res.status(200).json({
    //            mssage: 'Task updated'
    //        });

    //    })
    //    //.catch(err => { res.send("Nepoda�ilo se ulo�it film!") });
    //    .catch(err => {
    //        console.log(err);
    //        res.status(500).json({
    //            error: err
    //        });
    //    });