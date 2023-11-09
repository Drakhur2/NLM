
const http = new Library();

document.querySelector("#SendReq").addEventListener("click", (e) => {
    e.preventDefault();
    const radioButtons = document.querySelectorAll('input[name="HTTPtype"'); 
    const userData = document.querySelectorAll('input[class="UserData"'); 
    const route = document.querySelector("#route").value; 
    let reqType;
    let method;
    for (const radioButton of radioButtons) { 
        if (radioButton.checked) {
            reqType = radioButton.value;
            break;
        }    
    }
    if(reqType === "get"){
        method = enumerator.get;
    }else if(reqType === "post"){
        method = enumerator.post;
    }
    else if(reqType === "delete"){
        method = enumerator.delete;
    }else{
        method = enumerator.patch;
    }
    if(method !== 1){
        
        const NewRoute = 'http://localhost:5002/api/';
        sendRequest(method, NewRoute, userData);
    }else{
        sendRequest(method,route, userData); 
        // pollForUpdates()
    }
});
let enumerator = {
    get: 1,
    post: 2,
    delete: 4,
    patch: 5,
};
function ShowResponse(responseData, isDeletion) {
    
    let html = "<ul style='list-style:none'>";

    if (Array.isArray(responseData)) {
        responseData.forEach((data, index) => {
            html += processArrayData(data, index);
        });
    } else {
        html += processSingleData(responseData);
    }

    if (isDeletion === 4) {
        
        html += `<li style = 'text-align: left'>${responseData}</li>`;
    }
    if(isDeletion === 2){

        html += `<li>Successfully Created ${responseData}</li>`;
    }
    if(isDeletion == 3){
    
        html += `<li>Successfully Updated ${responseData}</li>`;
        
    }
    if(isDeletion === 5){
           
        html += `<li>Successfully Patched:${responseData}</li>`; 
    }

    document.querySelector("#response").innerHTML = html;
}

function processArrayData(data, index) {
    console.log(data, index);
    let html = "";
    html += `<li> ${index+1}: ${data}</li>`;
    return html;
}

function processSingleData(data) {
    let html = "";
    html += `<li style= 'text-align: left'>${data}</li>`;
   
    return html;
}

function pollForUpdates() {
    
    fetch('http://localhost:5002/api/')
        .then(response => response.json())
        .then(data => {
            // Process the received data here
            ShowResponse(data, reqType);
            console.log(data);
            // Set up the next poll
            setTimeout(pollForUpdates, 1000); // Poll every 5 seconds
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Retry after a delay
            setTimeout(pollForUpdates, 10000); // Retry after 10 seconds
        });
}


function ShowError(err) {
    // Log the error for debugging
    console.error("Error:", err);
    html = `<p>${err}</p>`;
    document.querySelector("#response").innerHTML = html;
}
async function sendRequest(reqType, targetURL) {
     let data = {
        name: document.querySelector("#name").value,
        id: document.querySelector("#id").value,
    };

    if(data.id === ""){
        delete data.id;
    };
     
    if(!data.id){
        if (data.name === "" && reqType !== 1){
        window.alert("Please provide the item name or description");
        throw new error("no item provided");
        };
    }
        
    try {
        let response;
        switch (reqType) {
            case 1:
                response = await http.Get(targetURL, data);
                break;
            case 2:
                response = await http.Post(targetURL, data);
                break;
            case 4:
                response = await http.Delete(targetURL, data);
                console.log(response);
            
                if(!response.ok){
                    throw new Error(`Error: ${response}`);
                }
                break;
            case 5:
                response = await http.patch(targetURL, data);
                
                if(!response.ok){
                    throw new Error("patch request failed");
                }
                
                break;
            }
        ShowResponse(response, reqType);
    } catch (exception) {
        ShowError(exception);
    }
};