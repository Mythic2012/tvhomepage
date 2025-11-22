imageIndex = 0

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

/*actually changes time
async function handleTimes(){
    for (const [key, value] of Object.entries(times)) {
        document.getElementById(value["IDs"][0]).innerHTML = `${value["Adhan"]}<a id="timeSuffix">${value["Suffix"]}</a>`
        document.getElementById(value["IDs"][1]).innerHTML = `${value["Iqamah"]}<a id="timeSuffix">${value["Suffix"]}</a>`
    }
}*/

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
    // repeat function every second
    setTimeout(clockHandler, 1000)
}

function changeImage(input){
    let posters = document.getElementsByClassName("poster");

    for (i = 0; i < posters.length; i++) {
        posters[i].style.display = "none";
    }

    if(imageIndex >= posters.length) {
        imageIndex = 0
    }

    posters[imageIndex].style.display = "block"
    imageIndex++

    if(input != 1){
        setTimeout(changeImage, 5500)
    } 
}

async function main(){
    await clockHandler()    
    changeImage()
}