
const http = new Library();
let enumerator = {
    get: 1,
    post: 2,
    put: 3,
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
        html += `<li>Successfully Created User with ID:${responseData}</li>`;
    }
    if(isDeletion == 3){
        if(data.name){
            html += `<li>Successfully Updated User with ID:${responseData}</li>`;
        }else{
            html += `<li>Successfully Updated User with ID:${responseData}</li>`;
        }
        
    }
    if(isDeletion === 5){
        if(data.name && data.username){
            html += `<li>Successfully Patched User with ID:${responseData.id}</li>`;
        }else{
           html += `<li>Successfully Patched Title with ID:${responseData.id}</li>`; }
        }

    document.querySelector("#response").innerHTML = html;
}

function processArrayData(data, index) {
    console.log(data, index);
    let html = "";
    html += `<li>item ${index}: ${data}</li>`;
    return html;
}

function processSingleData(data) {
    let html = "";
    html += `<li style= 'text-align: left'>${data}</li>`;
   
    return html;
}

// function processSingleData(data) {
//     let html = "";

//     if (data.title) {
//         html += `<li style=' text-align:left'> |(^_^)|>>${data.id} Title: <strong>${data.title}</strong> - <br> <italic>Body: </italic> ${data.body}</li>`;
//     } else if (data.name && data.username) {
//         html += `<li style= 'text-align: left'>User ${data.id} - Name: ${data.name} - Username: ${data.username} - Email: ${data.email}</li>`;
//     } else {
//         html += `<li>User ${data} - ${data.body}</li>`;
//     }

//     return html;
// }


function ShowError(err) {
    // Log the error for debugging
    console.error("Error:", err);
    html = `<p>${err}</p>`;
    document.querySelector("#response").innerHTML = html;
}
    async function sendRequest(reqType, targetURL) {
        let data = {
            name: document.querySelector("#name").value,
            username: document.querySelector("#userName").value,
            email: document.querySelector("#email").value,
            id: document.querySelector("#id").value,
        };
        if(data.id === ""){
            delete data.id;
        }
        if(data.username === ""){
            delete data.username;
        }
        if(data.email === ""){
            delete data.email;
        }
        // if(reqType === 5){
        //     data["title"] = data["name"];
        //     data["body"] = data["username"];
        // }
        
    try {
        let response;
        switch (reqType) {
            case 1:
                response = await http.Get(targetURL);
                break;
            case 2:
                response = await http.Post(targetURL, data);
                break;
            case 3:
                if(!isNaN(data.id)){
                    response = await http.Put(`${targetURL}/${data.id}`);
                }else{
                    response = await http.Put(targetURL, data);
                }
                break;
            case 4:
                response = await http.Delete(targetURL, data);
                if(!response.ok){
                    throw new Error(`Error: ${response.statText}`);
                }
                break;
            case 5:
                // if(!isNaN(data.id)){
                //     response = await http.patch(`${targetURL}/${data.id}`, data);
               
                response = await http.patch(targetURL, data);
                
                break;
            }
        ShowResponse(response, reqType);
    } catch (exception) {
        ShowError(exception);
    }
}

document.querySelector("#SendReq").addEventListener("click", (e) => {
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
    else if(reqType === "put"){
        method = enumerator.put;
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
    }
    
    e.preventDefault();
});