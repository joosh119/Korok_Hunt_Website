import { createUser, findKorok, setKorok } from "./js/link.js";

const MAX_KOROK_NUMBER = 4;

// var cached_username;
var cached_admin_password;


//Before reloading
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// AWAKE
document.addEventListener('DOMContentLoaded', _ => {

});

// START
window.onload = function initialize(){    
    // Check the korok from the query parameters
    checkKorok();
}



// USER MANAGEMENT
async function getUserName(){
    // check if cookie exists
    let username = getCookie("username");
    if(username == ""){
        console.log("Cookie does not exist, it is being created");
        //Request username popup underneath
        username = await requestUsername();
    }
    else{
        console.log("Username:" + username);
    }

    return username;
}

async function requestUsername(){
    // Never used site before, show explanation
    infoPopup();
    
    // Popup to request the username
    var u_popup = usernamePopup();
    var textarea = u_popup.getElementsByTagName("textarea")[0];

    var button_pressed = false;
    var username;
    u_popup.getElementsByTagName("button")[0].onclick = async function() {
        //check if a valid username was inputted
        username =  textarea.value;

        //if username was invalid
        if(username != ""  &&  username.includes('@')  &&  await createUser(username)){
            button_pressed = true;
        }
        else{
            document.getElementById("invalid_name").style.visibility = "visible";
        }
    };


    while(!button_pressed){
        await new Promise(r => setTimeout(r, 100));
    }

    setCookie("username", username);

    closePopup(u_popup);


    return username;
}




// KOROK MANAGEMENT
//SERVER----------------------------
// Check if korok with the id exists
async function checkKorok(){
    const url = new URL(window.location);
    console.log(url.toString());
    var url_params = new URLSearchParams(url.search);
    var korok_id = url_params.get("k_id");

    //url_params.delete("k_id");
    history.pushState(null, "", location.href.split("?")[0]);
    
    console.log("Korok Id: " + korok_id);
    
    //Check if there was a korok_id to check
    if(korok_id != null){
        // Get the username, either from a cookie or querying the user
        var username = await getUserName();
        
        // Tell server we found a korok
        const return_data = await findKorok(username, korok_id);
        if(return_data != null){
            validKorok(return_data);
        }
        else{
            unknownKorok();
        }
    }
}

//SERVER----------------------------
// The korok found from the url given
async function validKorok(return_data){
    //Display ui
    korokFoundPopup(return_data.korok_number, return_data.new_korok_count, !return_data.already_found, 0);
}

// Korok with unknown id
function unknownKorok(){    
    unknownKorokPopup();
}



// ADMIN KOROK MANAGEMENT
// Checks the admin password, checks the location, and calls method that changes the korok position
function adminAccess(){
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

// Set position of the korok
function setPosition(position){
    //set position of korok, sending the admin password
    setKorokLocation(position, saved_admin_password);
}



// UI
// Loads the korok popup with the given korok number
function korokFoundPopup(korok_num, korok_count, new_korok, ranking){
    var kf_popup = document.getElementById("kf_popup");

    openPopup(kf_popup);

    //Add action to button that closes the popup
    kf_popup.getElementsByTagName("button")[0].onclick = function() { closePopup(kf_popup) };
    
    //Load correct Korok image
    document.getElementById('korok_img').src = "/korok_hunt/img/koroks/k_" + korok_num + ".png";

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
    var rank_display = ranking + " player";
    if(ranking != 1)
        rank_display += "s";
    kf_popup.getElementsByTagName('rank')[0].textContent = rank_display;



    return kf_popup;
}

function unknownKorokPopup(){
    var uk_popup = document.getElementById("uk_popup");

    openPopup(uk_popup);

    //Add action to button that closes the popup
    uk_popup.getElementsByTagName("button")[0].onclick = function() { closePopup(uk_popup) };

    return uk_popup;
}

function usernamePopup(){
    var u_popup = document.getElementById("u_popup");

    openPopup(u_popup);

    return u_popup;
}

function infoPopup(){
    var i_popup = document.getElementById("i_popup");

    openPopup(i_popup);

    //Add action to button that closes the popup
    i_popup.getElementsByTagName("button")[0].onclick = function() { closePopup(i_popup) };

    return i_popup;
}


//Fades the element in and locks the screen scrolling
function openPopup(popup){
    //Display stuff
    fadeIn(popup, 400);

    //Disallow scrolling
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

//Fades the element out and allows the screen to be scrolled
function closePopup(popup){
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



// UTILITY
function getCookie(c_name){
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function setCookie(c_name, data){
    // Build the expiration date string:
    var expiration_date = new Date();
    var cookie_string = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    // Build the set-cookie string:
    cookie_string = c_name + "=" + data + "; path=/; expires=" + expiration_date.toUTCString();
    // Create or update the cookie:
    document.cookie = cookie_string;

    console.log("Cookie: " + document.cookie);
}