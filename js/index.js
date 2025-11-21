imageIndex = 0

async function fetchPosters(){
    await fetch("https://raw.githubusercontent.com/Mythic2012/tvhomepage/refs/heads/main/image_list.txt")
    .then(function(res){ return res.text()})
    .then(function(data){
        response = data.split("\n").slice(0, -1)

        response.forEach(link => {
            let img = document.createElement("img")
            img.src = link
            img.classList.add("poster")
            img.classList.add("fade")
            img.height = 800
            
            console.log(img)
            document.getElementById("twoContainer").appendChild(img)
        });
    })
}

async function fetchTimes(){
    let times;
    await fetch("https://www.broomhousemosque.org/wp-json/dpt/v1/prayertime?filter=today")
    .then(function(res){ return res.json() })
    .then(function(data){
        response = data[0]

        times = {
            "Fajr": {
                "Adhan": fixTimes(response.fajr_begins, 2),
                "Iqamah": fixTimes(response.fajr_jamah, 2),
                "IDs": ["fajr_adhan", "fajr_iqamah"],
                "Suffix": "am"
            },
            "Dhuhr": {
                "Adhan": fixTimes(response.zuhr_begins, 2),
                "Iqamah": fixTimes(response.zuhr_jamah, 2),
                "IDs": ["dhuhr_adhan","dhuhr_iqamah"],
                "Suffix": "pm"
            },
            "Asr": {
                "Adhan": fixTimes(response.asr_mithl_2, 2),
                "Iqamah": fixTimes(response.asr_jamah, 2),
                "IDs": ["asr_adhan","asr_iqamah"],
                "Suffix": "pm"
            },
            "Maghrib": {
                "Adhan": fixTimes(response.maghrib_begins, 2),
                "Iqamah": fixTimes(response.maghrib_jamah, 2),
                "IDs": ["maghrib_adhan","maghrib_iqamah"],
                "Suffix": "pm"
            },
            "Isha": {
                "Adhan": fixTimes(response.isha_begins, 2),
                "Iqamah": fixTimes(response.isha_jamah, 2),
                "IDs": ["isha_adhan", "isha_iqamah"],
                "Suffix": "pm"
            }
        }
    })

    return times;
}

// all time formatting
function fixTimes(date, method){
    if(method == 1){
        //turn 6 -> 06

        if (date < 10){
            date = `0${date}`
        }

        return date
    } else if (method == 2){
        // turn 06:66:66 -> 6:66

        let splitDate = date.split(":").slice(0, -1)
        splitDate[0] = fixTimes(splitDate[0].replace("0", ""), 3)

        return splitDate.join(":")
    } else if(method == 3){
        // turn 23 -> 11

        if (date > 12){
            date = date - 12
        }

        return date
    }
}

//actually changes time
async function handleTimes(){
    let times = await fetchTimes()

    for (const [key, value] of Object.entries(times)) {
        document.getElementById(value["IDs"][0]).innerHTML = `${value["Adhan"]}<a id="timeSuffix">${value["Suffix"]}</a>`
        document.getElementById(value["IDs"][1]).innerHTML = `${value["Iqamah"]}<a id="timeSuffix">${value["Suffix"]}</a>`
    }
}

// handles all time related activity
async function clockHandler(){
    // get date
    const date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    let suffix = hours >= 12 ? "pm" : "am"

    // clock
    document.getElementById("clock").innerHTML = `${fixTimes(fixTimes(hours, 3), 1)}:${fixTimes(minutes, 1)}:${fixTimes(seconds, 1)}<a id="clockSuffix">${suffix}</a>`

    //changing times & fetch new posters (if any)
    if(hours == 0 && minutes == 0 && seconds == 5){
        await handleTimes()
        await fetchPosters()
    }
    
    // repeat function every second
    setTimeout(clockHandler, 1000)
}

function changeImage(){
    let posters = document.getElementsByClassName("poster");

    for (i = 0; i < posters.length; i++) {
        posters[i].style.display = "none";
    }

    if(imageIndex >= posters.length) {
        imageIndex = 0
    }

    posters[imageIndex].style.display = "block"
    imageIndex++

    setTimeout(changeImage, 6500)
}

async function main(){
    await handleTimes()
    await clockHandler()
    await fetchPosters()

    changeImage()
}
