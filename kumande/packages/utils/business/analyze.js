const getStatusSodium = (val) => {
    let status = null

    if(val > 0.4){
        status = "High"
    } else if(val >= 0.14){
        status = "Moderate"
    } else if(val > 0.035){
        status = "Low"
    } else {
        status = "Very Low"
    }

    return status
}

const getStatusSugar = (val) => {
    let status = null

    if(val > 15){
        status = "High"
    } else if(val >= 5){
        status = "Moderate"
    } else if(val >= 2.6){
        status = "Low"
    } else {
        status = "Very Low"
    }

    return status
}

const getStatusCarbohydrates = (val) => {
    let status = null

    if(val > 30){
        status = "High"
    } else if(val >= 16){
        status = "Moderate"
    } else if(val >= 6){
        status = "Low"
    } else {
        status = "Very Low"
    }

    return status
}

const getStatusDietaryFiber = (val) => {
    let status = null

    if(val > 6){
        status = "High"
    } else if(val >= 4){
        status = "Moderate"
    } else if(val >= 1){
        status = "Low"
    } else {
        status = "Very Low"
    }

    return status
}

const getStatusSaturatedFats = (val) => {
    let status = null

    if(val > 5){
        status = "High"
    } else if(val >= 2){
        status = "Moderate"
    } else if(val >= 1){
        status = "Low"
    } else {
        status = "Very Low"
    }

    return status
}

module.exports = {
    getStatusSodium,
    getStatusSugar,
    getStatusCarbohydrates,
    getStatusDietaryFiber,
    getStatusSaturatedFats
}
