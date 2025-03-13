const { StatusCodes } = require("http-status-codes");
const {Logger} = require("../config/index.js");
const { ApiError } = require("../utils/index.js");

class CrudRepository{
    constructor(model){
        this.model=model;
    }
    async create(data){
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD : create");
            throw error;
        }
    }
    async destroy(data){
        try {
            const response = await this.model.destroy({where:{id:data}});
            if(!response){
                throw new ApiError("Airplane to delete not found", StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD : destroy")
            throw error;
        }
    }
    async get(data){
        try {
            const response = await this.model.findByPk(data);
            if(!response){
                throw new ApiError("Not able to find the given id", StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD : get")
            throw error;
        }
    }
    async getAll(){
        try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD : getAll")
            throw error;
        }
    }
    async update(id, data){  // data passed should be an object 
        try {
            const [response] = await this.model.update(data, {where:{id:id}});
            if(response === 0){
                throw new ApiError("Not able to find the given id to update", StatusCodes.NOT_FOUND);
            }
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD : update")
            throw error;
        }
    }

    
}

module.exports = CrudRepository;