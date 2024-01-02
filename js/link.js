import { Amplify } from 'aws-amplify'
//import awsconfig from '../aws-exports'

//Amplify.configure(awsconfig)


Amplify.configure({
    API: {
      GraphQL: {
        endpoint: 'https://on5zirq675enrfsurlvbfoiijq.appsync-api.us-east-2.amazonaws.com/graphql',
        region: 'us-east-2',
        defaultAuthMode: 'apiKey',
        apiKey: 'da2-mbjzzhi2wvcb3obtyftnz4w76u'
      }
    }
  });

import { API } from 'aws-amplify'
import { getUser, getKorok, listKoroks, listUsers } from "../src/graphql/queries"





//Checks the username with the server, and creates a user account.
//If invalid, return false and an account won't be created. Otherwise, return true.
export async function query_username(username){
    console.log("Checking username with server: " + username);

    return true;
}


//Check if korok exists. Returns korok number
export async function query_korok(korok_id){
    //const korok = ;
    const allKoroks = await API.graphql<GraphQLQuery<ListKoroksQuery>>({
        query: queries.listKoroks
    });
    console.log(allKoroks);

    const oneKorok = await API.graphql<GraphQLQuery<GetKorokQuery>>({
        query: queries.getKorok,
        variables: { id: korok_id }
    });
    console.log(oneKorok);

    
    return true;
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