import { Amplify } from '../node_modules/aws-amplify/dist/esm/index';
import config from '../aws-exports';

Amplify.configure(config);


import { generateClient } from '../node_modules/aws-amplify/dist/esm/api/index';
import { createUser } from '../src/graphql/mutations'

const client = generateClient();





const korok_count = 4;
var saved_korok_id;

var saved_admin_password;


//Before reloading
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

//Awake
document.addEventListener('DOMContentLoaded', _ => {

});

//Start
window.onload = function initialize(){    
    check_korok();
}



//USER MANAGEMENT
function setUserName(username){
    // Build the expiration date string:
    var expiration_date = new Date();
    var cookie_string = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    // Build the set-cookie string:
    cookie_string = "username=" + username + "; path=/; expires=" + expiration_date.toUTCString();
    // Create or update the cookie:
    document.cookie = cookie_string;

    console.log("Cookie: " + document.cookie);
}

async function getUserName(){
    //check if cookie exists
    var username = getCookie("username")
    //if(document.cookie == ""  || document.cookie.match("username") == null){
    if(username == ""){
        console.log("Cookie does not exist, it is being created");

        //Never used site before, show explanation
        info_popup();
        //Request username popup underneath
        username = await request_username();
    }
    else{
        console.log("Username:" + username);
    }
        

    return username;
}


function getCookie(c_name){
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

async function request_username(){
    var u_popup = username_popup();
    var textarea = u_popup.getElementsByTagName("textarea")[0];

    var button_pressed = false;
    var username;
    u_popup.getElementsByTagName("button")[0].onclick = function() {
        //check if a valid username was inputted
        username =  textarea.value;

        //if username was invalid
        if(username != ""  &&  username.includes('@')  &&  query_username(username)){
            button_pressed = true;
        }
        else{
            document.getElementById("invalid_name").style.visibility = "visible";
        }
    };


    while(!button_pressed){
        await new Promise(r => setTimeout(r, 100));
    }

    setUserName(username);

    close_popup(u_popup);


    return username;
}



//KOROK MANAGEMENT
//SERVER----------------------------
//check if korok with the id exists
async function check_korok(){
    const url = new URL(window.location);
    console.log(url.toString());
    var url_params = new URLSearchParams(url.search);
    var korok_id = url_params.get("korok");
    
    console.log("Korok Id: " + korok_id);
    
    //Check if there was a korok_id to check
    if(korok_id != null){
        saved_korok_id = korok_id;
        
        //check if there is a korok number with this ID
        if(query_korok(korok_id)){
            found_korok(korok_id);
        }
        else{
            unknown_korok(korok_id);
        }
    }
}

//SERVER----------------------------
//the korok found from the url given
async function found_korok(korok_id){
    console.log("Found Korok Id: " + korok_id);

    var username = await getUserName();
    
    //SERVER REQUESTS
        //retrieve the korok number
        var korok_num = Math.floor(korok_count*Math.random()) + 1;;
        //retrieve the current korok count of the user
        var prev_korok_count = 10;
        //increment korok score and recieve new korok count
        var new_korok_count = 11;
        //new ranking of player
        var new_ranking = 1;

    console.log("Retrieved Info: Korok num: " + korok_num + " Prev Count: " + prev_korok_count + " New Count: " + new_korok_count);

    //if the previous count is equal to the new, the user already found this korok
    var new_korok = (prev_korok_count!=new_korok_count);

    //Display ui
    korok_found_popup(korok_num, new_korok_count, new_korok)
}

//korok with unknown id
function unknown_korok(korok_id){
    console.log("Unknown Korok Id: " + korok_id);
    
    unknown_korok_popup();
}



//ADMIN KOROK MANAGEMENT
//Checks the admin password, checks the location, and calls method that changes the korok position
function admin_access(){
    var admin_password = prompt("Administrator Password:");
    if(admin_password == null)
        return;

    saved_admin_password = admin_password;

    //check location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(set_position);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

//set position of the korok
function set_position(position){
    //set position of korok, sending the admin password
    set_korok_location(position, saved_admin_password);
}



//UI
//loads the korok popup with the given korok number
function korok_found_popup(korok_num, korok_count, new_korok, ranking){
    var kf_popup = document.getElementById("kf_popup");

    open_popup(kf_popup);

    //Add action to button that closes the popup
    kf_popup.getElementsByTagName("button")[0].onclick = function() { close_popup(kf_popup) };
    
    //Load correct Korok image
    document.getElementById('korok_img').src = "images/korok_" + korok_num + ".png";

    //Display if this korok has already been found
    if(!new_korok){
        kf_popup.getElementsByTagName("found")[0].textContent = "You've already found this korok";
        kf_popup.getElementsByTagName("b_found")[0].textContent = "Ok";
    }

    //Set korok count
    var count_display = korok_count + " Korok";
    if(korok_count > 1)
        count_display += "s";
    kf_popup.getElementsByTagName('count')[0].textContent = count_display;

    //Set ranking
    kf_popup.getElementsByTagName('rank')[0].textContent = ranking;



    return kf_popup;
}

function unknown_korok_popup(){
    var uk_popup = document.getElementById("uk_popup");

    open_popup(uk_popup);

    //Add action to button that closes the popup
    uk_popup.getElementsByTagName("button")[0].onclick = function() { close_popup(uk_popup) };

    return uk_popup;
}

function username_popup(){
    var u_popup = document.getElementById("u_popup");

    open_popup(u_popup);

    return u_popup;
}

function info_popup(){
    var i_popup = document.getElementById("i_popup");

    open_popup(i_popup);

    //Add action to button that closes the popup
    i_popup.getElementsByTagName("button")[0].onclick = function() { close_popup(i_popup) };

    return i_popup;
}


//Fades the element in and locks the screen scrolling
function open_popup(popup){
    //Display stuff
    fadeIn(popup, 400);

    //Disallow scrolling
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

//Fades the element out and allows the screen to be scrolled
function close_popup(popup){
    //Display stuff
    fadeOut(popup, 400);

    //Allow scrolling
    document.getElementsByTagName('body')[0].style.overflow = 'visible';
}



//Fade in element
function fadeIn( elem, ms )
{
    if( ! elem )
        return;

    elem.style.opacity = 0;
    elem.style.filter = "alpha(opacity=0)";
    elem.style.display = "inline-block";
    elem.style.visibility = "visible";

    if( ms )
    {
        var opacity = 0;
        var timer = setInterval( function() {
        opacity += 50 / ms;
        if( opacity >= 1 )
        {
            clearInterval(timer);
            opacity = 1;
        }
        elem.style.opacity = opacity;
        elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50 );
    }
    else
    {
        elem.style.opacity = 1;
        elem.style.filter = "alpha(opacity=1)";
    }
}
//Fade out element
function fadeOut( elem, ms )
{
    if( ! elem )
        return;

    if( ms )
    {
        var opacity = 1;
        var timer = setInterval( function() {
        opacity -= 50 / ms;
        if( opacity <= 0 )
        {
            clearInterval(timer);
            opacity = 0;
            elem.style.display = "none";
            elem.style.visibility = "hidden";
        }
        elem.style.opacity = opacity;
        elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50 );
    }
    else
    {
        elem.style.opacity = 0;
        elem.style.filter = "alpha(opacity=0)";
        elem.style.display = "none";
        elem.style.visibility = "hidden";
    }
}







//BACKEND MANAGEMENT
//Checks the username with the server, and creates a user account.
//If invalid, return false and an account won't be created. Otherwise, return true.
export async function query_username(username){
    console.log("Checking username with server: " + username);

    const newUser = await client.graphql({
        query: createUser,
        variables: {
            input: {
            "email": username,
            "collected_koroks":  []
        }
        }
    });


    return true;
}

//Check if korok exists. Returns korok number
export async function query_korok(korok_id){
    console.log("Finding Korok");

    const oneKorok = await client.graphql({
        query: getKorok,
        variables: { id: korok_id }
    });
    console.log(oneKorok);

    console.log("Found korok: " + oneKorok);
    return oneKorok;
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