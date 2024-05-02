exports.isDateWithin30Days = function (date) {
    let currentDate = new Date();
    let lastLoginDate = new Date(date);
    let timeDiff = currentDate.getTime() - lastLoginDate.getTime();
    let dayDiff = timeDiff / (1000 * 3600 * 24);
    if (dayDiff > 30) {
        return false
    } else {
        return true
    }
}

exports.isDateWithin5Minutes = function (date) {
    let currentDate = new Date();
    let targetDate = new Date(date);
    let timeDiff = currentDate.getTime() - targetDate.getTime();
    let minutesDiff = timeDiff / (1000 * 60);
    console.log(minutesDiff)
    if (minutesDiff > 0.5) {
        return false;
    } else {
        return true;
    }
};

exports.validateString = function (input) {
    let regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    if (regex.test(input)) {
        return true;
    } else {
        return false;
    }
}

exports.randomDataListFromDataList = function (data, getDataNumber) {
    if (getDataNumber >= data.length) {
        return data;
    }

    let tempIndex = [];
    for (let i = 0; i < data.length; i++) {
        tempIndex.push(i);
    }

    let index = [];
    while (getDataNumber > index.length) {
        let i = Math.floor(Math.random() * tempIndex.length);
        index.push(tempIndex[i]);
        tempIndex.splice(i, 1);
    };
    let tempData = [];
    for (let i = 0; i < index.length; i++) {
        tempData.push(data[index[i]])
    }
    return tempData
}

exports.removeSpecialCharacters = function (string) {
    let regex = /[^a-zA-Z0-9]/g;
    return string.replace(regex, "");
}

exports.createChoicesJSON = function (questionListChoice) {
    let JSON = {
        choices: []
    }
    for (let i = 0; i < questionListChoice.length; i++) {
        JSON.choices.push(questionListChoice[i].choices);
    }
    return JSON
}