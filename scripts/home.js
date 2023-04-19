
let loginEmail = localStorage.getItem("twitterLoginEmail");

if(!loginEmail) {
    window.location.href = "index.html";
}

let tweetOffset = 0;
let runningCriticalFunction = false;

/*================= Function to get Tweets ==================================================================================*/

async function getTweetsAndInsertHTML() {
    if(runningCriticalFunction) {
        return;
    }
    runningCriticalFunction = true;
    const result = await fetch(`https://twitter-backend-6yot.onrender.com/tweet/recent?offset=${tweetOffset}`); // Paginated API 

    const tweets = await result.json();

    console.log('tweets.data',tweets.data);

    tweetOffset = tweetOffset + tweets.data.length;

    document.getElementById('tweet-body').insertAdjacentHTML('beforeend', tweets.data.map((tweet) => {
        let currentTime = new Date();
        let showTime;
        let postedTime = new Date(tweet.creationDatetime);
        let timeDiff = currentTime - postedTime;
        timeDiff = Math.round(timeDiff/1000);

        if (timeDiff < 60) {
            showTime = timeDiff + 'sec';
        }
        else if (timeDiff >= 60 && timeDiff < 3600) {
            timeDiff = Math.round(timeDiff / 60);
            showTime = timeDiff + 'min';
        }
        else if (timeDiff >= 3600 && timeDiff < (3600 * 24)) {
            timeDiff = Math.round(timeDiff / 3600);
            showTime = timeDiff + 'hr';
        }
        else if (timeDiff >= (3600 * 24) && timeDiff < (3600 * 24 * 30)) {
            timeDiff = Math.round(timeDiff / (3600 * 24));
            showTime = timeDiff + 'days';
        }
        else if (timeDiff >= (3600 * 24 * 30) && timeDiff < (3600 * 24 * 30 * 12)) {
            timeDiff = Math.round(timeDiff / (3600 * 24 * 30));
            showTime = timeDiff + 'months';
        }
        else if (timeDiff >= (3600 * 24 * 30 * 12)) {
            timeDiff = Math.round(timeDiff / (3600 * 24 * 30 * 12));
            showTime = timeDiff + 'year';
        }
        
        return `<div id=${tweet._id} class="tweets">
            <div class="tweet-profile-image">
            <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt="profile image"
            />
            </div>
            <div class="tweet">
                <div class="tweet-header">
                    <div class="tweet-user-info">
                        <p id="tweet-userName">Rohan Palankar</p>
                        <p id="tweet-userId">@RohanVP8 |</p>
                        <p id="tweet-time">${showTime}</p>
                    </div>
                    <div class="tweet-three-dots-menu">
                        <button data-id=${tweet._id} class="tweet-edit" id="tweet-edit">
                            Edit
                        </button>
                        <button data-id=${tweet._id} class="tweet-delete" id="tweet-delete">
                            Delete
                        </button>
                        <button id="tweet-three-dots">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="#5b7083"
                                d="M16.5 10.25c-.965 0-1.75.787-1.75 1.75s.784 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.786-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.966 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75 1.75-.786 1.75-1.75-.784-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.965 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.787-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75z"
                            ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="tweet-body">
                    <span id='span-${tweet._id}'>${tweet.title}
                    </span>
                </div>
                <div class="tweet-footer-icons">
                    <span class="material-icons" title="View">bar_chart</span>
                    <span class="material-icons" title="Reply">chat_bubble_outline</span>
                    <span class="material-icons" title="Retweet">repeat</span>
                    <span class="material-icons" title="Like">favorite_border</span>
                    <span class="material-icons" title="Share">file_upload</span>
                </div>
            </div>
        </div>`
    }).join(""));
    runningCriticalFunction = false;
}

window.onload = async () => {
    getTweetsAndInsertHTML();
}


/*================= Function to Create Tweet ==================================================================================*/

document.addEventListener('click', async (event) => {
    if(event.target.classList.contains('tweet-post-btn')) {
        const tweetText = document.querySelector('.tweet-post-text').value;

        const data = {
            title: tweetText,
            text: "Random Value",
            userId: "12345"
        }
        
        const tweetResponse = await fetch('https://twitter-backend-6yot.onrender.com/tweet/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const tweet = await tweetResponse.json();

        if(tweet.status !== 200) {
            alert(tweet.message);
            return;
        }
        
        document.querySelector('.tweet-post-text').value = "";
        alert(tweet.message);
        location.reload();  
    }

/*================= Function to Delete Tweet ==================================================================================*/

    if(event.target.classList.contains('tweet-delete')) {

        if(confirm("Are you sure you want to delete this tweet?")) {
            const tweetId = event.target.getAttribute('data-id');

            const data = {
                tweetId,
                userId: "12345"
            };

            const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if(result.status !== 200) {
                alert(result.message);
                return;
            }
            
            alert("Tweet deleted successfuly");
            document.getElementById(tweetId).remove();
        }
    }

/*================= Function to Update Tweet ==================================================================================*/

    if(event.target.classList.contains('tweet-edit')) {
        const tweetId = event.target.getAttribute('data-id');

        const span = document.getElementById('span-' + tweetId);

        const tweetText = prompt("Enter new tweet text", span.innerText);

        const data = {
            tweetId,
            title: tweetText,
            text: "Random value",
            userId: "12345"
        }

        const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();

        if(result.status !== 200) {
            alert(result.message);
            return;
        }

        alert("Updated Successfully");
        span.innerText = tweetText;
    }

}) 


/*================= Function to get Tweets on Scroll ==================================================================================*/

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if((scrollTop + clientHeight) >= (scrollHeight - 20)) {
        getTweetsAndInsertHTML();
    }
})


/*===================================================================================================================================*/




let users = [

    {
        userName: "Rohan Palankar",
        userEmail: "rohanpalankar8@gmail.com",
        userId: "@RohanVP8",
        userImg: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        userProfession: "Web Developer",
        userLocation: "India",
        userJoinDate: "Joined December 2022",
        userFollowing: 16,
        userFollowers: 0,
    },
    {
        userName: "Rahul Shinde",
        userEmail: "rahul@gmail.com",
        userId: "@Rahul",
        userImg: "https://images.unsplash.com/photo-1608389769338-3d5ceb3c1bc4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHlvdW5nJTIwbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        userProfession: "Pharmacist",
        userLocation: "France",
        userJoinDate: "Joined February 2023",
        userFollowing: 35,
        userFollowers: 10
    }

]


// let loginEmail = localStorage.getItem("twitterLoginEmail");


users.forEach((user) => {

    if(user.userEmail == loginEmail){
        document.querySelector("#navbar-profile-img").src = user.userImg;
        document.querySelector("#navbar-profile-name").innerText = user.userName;
        document.querySelector("#navbar-profile-id").innerText = user.userId;
        document.querySelector("#profile-userId").innerText = user.userId;
        document.querySelector("#postBox-profile-img").src = user.userImg;
        document.querySelector("#profile-header-name").innerText = user.userName;
        document.querySelector("#profile-details-img").src = user.userImg;
        document.querySelector("#profile-details-name").innerText = user.userName;
        document.querySelector("#profile-details-id").innerText = user.userId;
        document.querySelector("#profile-details-profession").innerText = user.userProfession;
        document.querySelector("#profile-joinDate").innerText = user.userJoinDate;
        document.querySelector("#profile-location").innerText = user.userLocation;
        document.querySelector("#profile-following").innerText = user.userFollowing;
        document.querySelector("#profile-followers").innerText = user.userFollowers;
        document.querySelector("#profile-details-img-anchor").href = user.userImg;
        
        // document.querySelector("#profile-details-img").addEventListener("click", () => {
        //     window.location.href = user.userImg;
        // })

    }

})






/*=============================== Function to Logout =================================*/

const ThreeDotsProfile = document.getElementById("profile-threeDots");
const profileThreeDotsPopUp = document.getElementById("profile-threeDots-popUp");
const profileLogOut = document.getElementById("profile-logOut");


document.addEventListener("click", (e) => {

    if (e.target.id == "profile-threeDots"){
        profileThreeDotsPopUp.style.display = "block";
    } else {
        profileThreeDotsPopUp.style.display = "none";
    }
    
})


profileLogOut.addEventListener("click", () => {

    setTimeout(() => {
        localStorage.removeItem("twitterLoginEmail");
        window.location.href = "index.html";
    }, 1000);
    
})




/*=================== Right-sideBar-Scrolling-effect =====================*/ 


window.onscroll = function() {myFunction()};

var happWhoDiv = document.querySelector(".happ-who-div");

function myFunction() {

  if (window.pageYOffset > 300) {
    happWhoDiv.classList.add("sticky");
  } else {
    happWhoDiv.classList.remove("sticky");
  }
}




/*=================== Home to Profile navigation =====================*/ 


const profile_logo = document.getElementById("nav-item-profile");
const profile_left_arrow = document.getElementById("profile-left-arrow");
const home_content = document.querySelector(".home-content");
const profile_content = document.querySelector(".profile-content");
const postbox_profileImage = document.querySelector("#postBox-profile-img");




profile_logo.addEventListener("click", () => {
    profile_logo.style.fontWeight = "bold";
    home_content.style.display = "none";
    profile_content.style.display = "block";
});

profile_left_arrow.addEventListener("click", () => {
    profile_logo.style.fontWeight = "lighter";
    profile_content.style.display = "none";
    home_content.style.display = "block";
});

postbox_profileImage.addEventListener("click", () => {
    profile_logo.style.fontWeight = "bold";
    home_content.style.display = "none";
    profile_content.style.display = "block";
});




