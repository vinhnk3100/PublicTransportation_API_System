const listOfItems = (listId) => {
    const checkValidObjectId = listId.map( id => {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return id
        }
    })
    return checkValidObjectId.filter(x => { return x !== undefined })
}

const singleItem = (itemId) => {
    if (itemId.match(/^[0-9a-fA-F]{24}$/)) {
        if (itemId) {
            return itemId;
        }
    }
}

module.exports = {
    listOfItems,
    singleItem
};