//Checks the username with the server, and creates a user account.
//If invalid, return false and an account won't be created. Otherwise, return true.
export async function createUser(username){
    console.log("Checking username with server: " + username);

    // Send username to server
    const query_string = "https://8n8fsfczsl.execute-api.us-east-2.amazonaws.com/create_user" + "?username=" + username;
    const result = await fetch(query_string);
    const status = result.status;
    
    // If the status is 200, the username was added to the database
    console.log("Username added: " + (status == 200));
    return status == 200;
}


//Increments score of player and returns the new korok count, as well as the user's ranking and the korok number
export async function findKorok(username, korok_id){
    console.log("Finding Korok: " + korok_id);

    // Send username and korok id to server
    const query_string = "https://8n8fsfczsl.execute-api.us-east-2.amazonaws.com/find_korok" + "?username=" + username + "&k_id=" + korok_id;
    const result = await fetch(query_string);
    const status = result.status;
    const data = await result.json();

    console.log(data);

    //If the status is 200, the korok was successfully found
    if(status == 200){
        console.log("Korok found: " + data.korok_number);

        // Check if the korok was already found by the user
        if(data.already_found){
            console.log("Korok already found by user");
        }

        return data;
    }
    else{
        console.log("Error Finding Korok");

        return null;
    }
}


//Sets the koroks position
//https://8n8fsfczsl.execute-api.us-east-2.amazonaws.com/set_korok?k_id=10&k_num=5&description=Somewhere%20sometime&lat=99.99999&long=98.88888&password=KorokHunt662058949
export async function setKorok(korok_id, korok_number, description, position, admin_password){
    console.log("Setting korok location at: " + position + " with admin password: " + admin_password);

    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    // Send params to server
    const query_string = "https://8n8fsfczsl.execute-api.us-east-2.amazonaws.com/set_korok"
        + "?k_id=" + korok_id
        + "&k_num=" + korok_number
        + "&description=" + description
        + "&lat=" + lat
        + "&long=" + long
        + "&password=" + admin;
    const result = await fetch(query_string);
    const status = result.status;

    // If the status is 200, the username was added to the database
    console.log("Korok added: " + (status == 200));
    return status == 200;
}