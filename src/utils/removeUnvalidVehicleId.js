const removeUnvalidVehicleId = (listOfVehicleId) => {
    const checkValidObjectId = listOfVehicleId.map(vehicleId => {
        if (vehicleId.match(/^[0-9a-fA-F]{24}$/)) {
            return vehicleId
        }
    })
    return checkValidObjectId.filter(x => { return x !== undefined })
}

module.exports = removeUnvalidVehicleId;