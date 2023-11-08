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
    const data = await fm.ReadData();
    res.json(data);
  } catch(error){
    res.status(500).json({error: "Internal server Error"});
  }
});

app.post("/api", async (req,res) => {

  try{
    console.log("post, server side");
    const requestdata = req.body.item;
    const currData = await fm.ReadData();
    currData.push(requestdata);
    await fm.WriteData(currData);
    res.status(200).json(requestdata);

  }catch(error){
    res.status(500).json({error: "internal Server Eroor:posting prob"})
  }

});
// app.delete("/api/:item", async (req, res) => {
//   try{
//       const item = req.params.item;
//       let currData = await fm.ReadData();
//       currData = currData.filter((val)=> val !== item );
//       const itemIndex = currData.indexOf(item,1)
//       if(itemIndex !== -1){
//         currData.splice(itemIndex, 1)
//       }
//       await fm.WriteData(currData);
//       res.sendStatus(204);
//       }catch(err){
//      console.log(`could not delete:${err}`);
//   }
// });
app.delete('/api/:item', async (req, res) => {
  try {
    console.log("deletion");
      const ItemID = decodeURIComponent(req.params.item);
      
      let listItems = await fm.ReadData(); // Read current data
      // console.log(ItemID);
      let iter = listItems.length;
      
      let baseiter;
      // console.log(iter);
      do{
        console.log("iterating");
    
        iter--;
        // console.log(ItemID, listItems[iter]);
        // console.log(listItems[iter].includes(ItemID.slice(6, ItemID.length)));
        // console.log(ItemID.slice(0,6));
        if(listItems[iter].includes(ItemID.slice(6, ItemID.length))){
          console.log('found');
          listItems.splice(iter, 1);
          baseiter = iter;
        }

      }while(iter > 0);
      // const updatedListItems = listItems.filter(listItem => !listItem.includes(ItemID));

      if(baseiter !== listItems.length){
        // delete originListItems;
        await fm.WriteData(listItems); // Write updated data back to listdata.json
        res.status(200).send(`item containing ${ItemID} was successfully deleted`);
      
        console.log("Test if written correctly");
      }else{
        console.log("Another test");
        throw new Error('server error');
      }
       
    } catch (error) {
      res.status(500).send('Could not find the specified item');
  }
});

// page not found route
app.all("*", (req,res) => {
  res.status(404).send("<h1>Page Not Found...</h1>");
});

// Create a server
const appName = "Simple List";
const port = 5002;
app.listen(port, () => {
  console.log(`App ${appName} is running on port ${port}`);
});