// Get 3rd Party modules
const express = require("express");
const Cors = require("cors");
// Get Custom built modules
const fm = require("./filemgr");

// Create the express http server
const app = express();

// Define some built-in middleware
app.use(Cors({origin: "http://127.0.0.1:5500"}));
app.use(express.static("./Client"));
app.use(express.json());

// Define HTTP routes listenting for requests
app.get("/api", async (req,res) => {
  try{
    const data = await fm.ReadData();  //read the data
    res.json(data); //send the sesponse as a json
  } catch(error){
    res.status(500);
    res.json({error: "Internal server Error"});  //error occured
  }
});

app.post("/api", async (req,res) => {

  try{
    console.log("post, server side");
    const requestdata = req.body.item;
    const currData = await fm.ReadData();   //read the data
    currData.push(requestdata);  //update the array
    await fm.WriteData(currData);  //write the updated array to listdata.json
    res.status(200).json(requestdata);

  }catch(error){
    res.status(500);
    res.json({error: "internal Server Error:posting prob"})
  }

});
app.patch("/api/:item", async (req, res) =>{
  try{

    let itemToUpdate = decodeURIComponent(req.params.item);  //decode the url item
    console.log(`${itemToUpdate} is being updated`);

    let list = await fm.ReadData();

    console.log(list);
    console.log(itemToUpdate);  //visual analysis

    let iter = list.length;  //for the do while loop
    let found = false;  
    do{
    
      iter--;
      
      if(list[iter].slice(0, list[iter].search(", ")) === itemToUpdate){
        console.log(list[iter]+ " "+itemToUpdate);
        console.log('found');
        throw new Error("item already in the list");
      }
      let test = list[iter].slice(6, list[iter].length);
      let idVal = itemToUpdate.slice(itemToUpdate.search("id: "), itemToUpdate.length);
      
      if(test.includes(idVal)){
        //if the id was found
        found = true;
        SliceEnd = list[iter].search(", "); //returns the index
        
        list[iter] = list[iter].replace(list[iter].slice(0, list[iter].length), itemToUpdate); //replace the name of the list with the new name
        
      }

    }while(iter > 0);
   
    if(found === true){

      await fm.WriteData(list); // Write updated data back to listdata.json
      res.status(200);
      res.json(`item ${ItemID} was successfully patched`);

    }else{

      throw new Error("Item not in the list")
    }

  } catch(error){

    res.status(400);
    res.json({message:"server error"});

  }
  
});
  
app.delete('/api/:item', async (req, res) => {
  try {
    console.log("deletion");
      const ItemID = decodeURIComponent(req.params.item);
      
      let listItems = await fm.ReadData(); // Read current data
    
      let iter = listItems.length;
      
      let baseiter;
      baseiter = iter;
      console.log(iter, listItems.length);
      
      do{

        iter--;
        
        if(listItems[iter].includes(ItemID.slice(6, ItemID.length))){  //test if the list item exists in the array
          console.log('found');
          listItems.splice(iter, 1);  //delete it from the array
          console.log(listItems);
        
        }

      }while(iter > 0);
     
      console.log(baseiter, listItems.length);

      if(baseiter !== listItems.length){
        
        await fm.WriteData(listItems); // Write updated data back to listdata.json
        res.status(200);
        res.json(`item ${ItemID} was successfully deleted`);
  
        console.log("Test if updated");

      }else{
        console.log("Nothing was deleted");
        throw new Error('server error: nothing was deleted');
      }
       
    } catch (error) {
      res.status(500);
      res.json('Could not find the specified item');
  }
});

// page not found route
app.all("*", (req,res) => {
  res.status(404).json("<h1>Page Not Found...</h1>");
});

// Create a server
const appName = "Simple List";
const port = 5002;
app.listen(port, () => {
  console.log(`App ${appName} is running on port ${port}`);
});