/**
 * Function will do: Return the same ID from ticket route & Route id
 *  => Compare route id inside ticket with current route remove
 *  => If Route is removed, all ticket with the same route will turn 'is_valid' into False (Mean that the ticket will no longer be available for user to use)
 */
const filterListOfTicketId = (tickets, routeId) => {
    let ticketid = [];
    tickets.forEach(ticket => {
        if (ticket.route_name._id.toHexString() === routeId) {
            return ticketid.push(ticket._id.toHexString());
        }
    })

    return ticketid;
}

const filterTicketIdSameRouteId = async (routes, tickets) => {
    // Route
    const filterRouteId = routes.map(route => {
        return route._id.toHexString();
    })

    const routeId = filterRouteId[0]

    // Tickets
    const ticketId = filterListOfTicketId(tickets, routeId);

    return ticketId;
}

module.exports = filterTicketIdSameRouteId;