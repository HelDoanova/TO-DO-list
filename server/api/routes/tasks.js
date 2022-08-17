const express = require("express");
const router =  new express.Router();   //--new
//const mongoose = require("mongoose");                         //uz nepotrebuju je to v Controllers
//const checkAuth = require("../middleware/check-auth");

//const Task = require("../models/task");                       //uz nepotrebuju je to v Controllers
const TasksController = require("../controllers/tasks");

//GET pro v�e - vr�t� v�echny �koly
router.get("/", TasksController.tasks_get_all);         //MOJE checkAuth - mezi / ,checkAuth, TaskController   --tasks

//POST - vytvo�en� / write
router.post("/", TasksController.tasks_create_task);                                     //, checkAuth

//GET - �ten�               
router.get('/:taskId', TasksController.tasks_get_task);                                           //MOJE//, checkAuth

//DELETE -smaz�n�
router.delete('/:taskId', TasksController.tasks_delete_task);                                    //, checkAuth

//PATCH - update
router.patch('/:taskId', TasksController.tasks_update_task);                                   //, checkAuth

module.exports = router;