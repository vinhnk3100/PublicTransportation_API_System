const listOfItems = (listId) => {
    const checkValidObjectId = listId.map( id => {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return id
        }
    })
    return checkValidObjectId.filter(x => { return x !== undefined })
}

module.exports = {
    listOfItems
};