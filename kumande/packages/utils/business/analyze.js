

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

module.exports = getStatusSodium
