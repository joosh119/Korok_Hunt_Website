import { API } from 'aws-amplify';
import * as mutations from './graphql/mutations';

const todoDetails = {
  name: 'Todo 1',
  description: 'Learn AWS AppSync'
};

const newTodo = await API.graphql({
  query: mutations.createTodo,
  variables: { input: todoDetails }
});



//Checks the username with the server, and creates a user account.
//If invalid, return false and an account won't be created. Otherwise, return true.
export async function query_username(username){
    console.log("Checking username with server: " + username);

    return true;
}


//Check if korok exists. Returns korok number
export async function query_korok(korok_id){

}

//Increment score of player returns new korok count as well as the user's ranking
export async function increment_score(username, korok_id){

}

//Returns player korok count and ranking
export async function get_player_stats(username){

}



//all in one
export async function find_korok(korok_id, username){

}


//Sets the koroks position
export async function set_korok_location(position, admin_password){
    console.log("Setting korok location at: " + position + " with admin password: " + admin_password);

    var lat = position.coords.latitude;
    var long = position.coords.longitude;

}