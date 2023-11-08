// const {json} = require("express");

// import { json } from "express";
// const { json } = require("cors")

class Library {

    constructor(){
    }
    
    async Get(targetURL){ // Tested, Works
        let response;

        const requestOptions = {
            method: "GET",
            headers: {"content-type": "application/json"}
        };
        const test = await fetch(targetURL, requestOptions);
        console.log(test.json());
        response = await this.#processFetch (targetURL, requestOptions);
        return await response.json();
    }

    async Post(targetURL, data){ 
        let response;
    
        let stringRepresentation = await this.#objectToString(data);
    
        console.log(stringRepresentation); 
        const jdata = {
            item: stringRepresentation,
        };

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jdata), // it is a plain text
        };
        response = await this.#processFetch (targetURL, requestOptions);
        return await response.json();
    }
    

    async Put(targetURL, data){ 
        let response;
    
        const requestOptions = {
            method: "PUT",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(data),
        };
        response = await this.#processFetch (targetURL, requestOptions);
        return await response.json();
    }

    async Delete(targetURL, data) { // working on it
        let response;

        let stringRepresentation = await this.#objectToString(data);
    try{
        console.log(stringRepresentation); 

        const encodedItemName = encodeURIComponent(stringRepresentation);
        // const jdata = {
        //     item: stringRepresentation,
        // };
        const fullURL = `${targetURL}${encodedItemName}`;
        const requestOptions = {
            method: "DELETE"
            // headers: {"content-type": "application/json"},
            // body: JSON.stringify(jdata)
        };
            
        response = await fetch(fullURL, requestOptions);
        
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
            
        }
        console.log(response.status);
        return await response;
    }catch(error){
        console.error("Could not delete",error);
        return `Error: ${error.message}`;
    }
        
    }
async patch(targetURL, data){
    let response;
    const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      response = await this.#processFetch(targetURL, requestOptions);
      return await response.json();
        
    }

    async #processFetch (targetURL, requestOptions) { 
        console.log("Requesting URL:", targetURL);
        try {
            
            let data = await fetch(targetURL, requestOptions);
            console.log(data.status);
            let afterUpdate = await fetch (targetURL, {
                method: "GET",
                headers: {"content-type": "application/json"}
            });
            return await afterUpdate;
        }catch (exception) { //error alert
            throw exception;
        }
    }
    async #objectToString(obj) {
        const data = Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join(', ');
        return data;
    }

}