import { getUserScores } from "../js/link.js";

// START
window.onload = function initialize(){    
    populateLeaderboard();
}


async function populateLeaderboard(){
    // Get raw list of names and koroks from session storage
    let user_scores = JSON.parse(sessionStorage.getItem("user_scores"));
    const scores_expiration_date = sessionStorage.getItem("scores_expiration_date");
    // If they don't exist in session storage, check the server
    if(user_scores == null  ||  scores_expiration_date < Date.now()){
        // Get list from server and save it to the session storage
        user_scores = await getUserScores();
        sessionStorage.setItem("user_scores", JSON.stringify(user_scores));
        // Expire the leaderboard in 1 minute
        sessionStorage.setItem("scores_expiration_date", Date.now() + 1*60000);
    }
        
    // Sort list of scores
    user_scores.sort((a,b) => b.korok_count - a.korok_count);

    // Set scores onto leaderboard
    setLeaderboard(user_scores);
}


function setLeaderboard(user_scores){
    let leaderboard = document.getElementById("leaderboard");
    const leaderboard_element = leaderboard.getElementsByClassName("leaderboard_container")[0];

    for (let i = 0; i < user_scores.length; i++){
        // Copy leaderboard element and add values to it
        let new_leaderboard_element = leaderboard_element.cloneNode(true);
        new_leaderboard_element.getElementsByTagName("rank")[0].textContent = i+1 + '.';
        new_leaderboard_element.getElementsByTagName("username")[0].textContent = user_scores[i].username;

        let count_string = user_scores[i].korok_count + " Korok";
        if(user_scores[i].korok_count != 1) count_string += 's';
        new_leaderboard_element.getElementsByTagName("count")[0].textContent = count_string;

        // Append new element to the end of the leaderboard
        leaderboard.appendChild(new_leaderboard_element);
    }

    // Remove the first element
    leaderboard.removeChild(leaderboard_element);
}