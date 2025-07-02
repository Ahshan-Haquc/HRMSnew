
const createError = require('http-errors');
const mongoose = require('mongoose');

const findWithId = async(Model, id, option={}) =>{
    try { 
    
        const item = await Model.findById(id, option);
        if(!item) {
            throw createError(404,Model.modelName+" dose not exist with this id");
        }
        return item;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400," Invalid Id");
    
        };
        throw error;
    }


}

module.exports = {findWithId};





