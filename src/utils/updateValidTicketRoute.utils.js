/**
 * Function will do: Return the same ID from ticket route & Route id
 *  => Compare route id inside ticket with current route remove
 *  => If Route is removed, all ticket with the same route will turn 'is_valid' into False (Mean that the ticket will no longer be available for user to use)
 */
const getRouteIdFromTicket = (tickets) => {
    const getAllRouteNames = tickets.map(ticket => {
        return ticket.route_name;
    })

    const getRouteIdFromRouteName = getAllRouteNames.map(routeName => {
        return routeName._id.toHexString();
    })

    return getRouteIdFromRouteName
}

const updateValidTicketRoute = async (routes, tickets) => {
    // Route
    const filterRouteId = routes.map(route => {
        return route._id.toHexString();
    })

    const routeId = filterRouteId[0]

    // Tickets
    const listRouteIdFromTickets = getRouteIdFromTicket(tickets)

    const listOfTicketId = tickets.map(ticket => {
        return ticket._id.toHexString();
    })

    // const filterSameTicketRouteId = 

    console.log(listOfTicketId)

    // return filterSameTicketRouteId;
}

module.exports = updateValidTicketRoute;