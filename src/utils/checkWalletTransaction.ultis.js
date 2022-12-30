
exports.isWalletInsufficient = async (route, userWallet) => {
    try {
        const routePrice = route.route_price;

        // False if user wallet is Insufficient
        if (userWallet < routePrice) {
            return false
        }

        return true
    } catch (e) {
        throw new Error(e.message)
    }
}
