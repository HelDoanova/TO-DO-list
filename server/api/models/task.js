const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskName: { type: String, required: true },
    complete: { type: Boolean, default: false, required: false }   //neni vy�adov�no p�i POST
    //situation: { type: Boolean, default: false }  ----DEFAULT
    //situation: { type: Boolean, required: true }
    //situation: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true } --order pak vymazat
});

module.exports = mongoose.model("Task", taskSchema);

// video7 -- nefunguje mi vypysov�n� error� na validaci , hned ze zacatku videa
// video8 -- o�et�en� neexistuj�c�ho produktu ... mozna se bude hodit i na task
// video8 -- outsorce do general function (errory:500/404 atd) kterou pak volame v tasks v catch //mozna se bude hodit ne ?
//        -- zjistit jak na to 19:30 min
// video10 -- cost fileFilter function 13:40
