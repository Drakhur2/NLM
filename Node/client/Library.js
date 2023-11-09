class Library {

    constructor(){
    }
    
    async Get(targetURL){ // Tested, Works
        let response;
        const jdata = {item: null};
        if (data.name === ""){
            data = null;
        }else{
            let stringRepresentation = await this.#objectToString(data);
    
            console.log(stringRepresentation); 

            jdata.item = stringRepresentation;

        }
        const requestOptions = {
            method: "GET",
            headers: {"content-type": "application/json"},
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
    

    async Delete(targetURL, data) { // working //on it
        let response;

        let stringRepresentation = await this.#objectToString(data);
    try{
        console.log(stringRepresentation); 

        const encodedItemName = encodeURIComponent(stringRepresentation);
        
        //create the full url with the data attched
        const fullURL = `${targetURL}${encodedItemName}`;
        const requestOptions = {
            method: "DELETE"

        };
            
        response = await fetch(fullURL, requestOptions);
        
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
            
        }
        const outData = await response.json();
       
        return outData;
    }catch(error){
        console.error("Could not delete",error);
        return `${error}`;
    }
        
}
async patch(targetURL, data){
    let response;

    if(!data.id){
        delete data.id;
    };

    try{
        let stringRepresentation = await this.#objectToString(data);
        
        const encodedItemName = encodeURIComponent(stringRepresentation);
        //create the full url with the data attached
        const fullURL = `${targetURL}${encodedItemName}`;
        
        const requestOptions = {
        method: 'PATCH'
    };

      response = await fetch(fullURL, requestOptions);
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }
      const resp = await response.body;
      console.log(resp);
      return resp;
        
    }catch(error){
        console.log(`Error: ${error}`);
        throw error;
    }
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