import React, { Component } from 'react';

class SubscriptionsTab extends Component {

    render() {
        const subscriptionsResults = this.props.subscriptions;
        let subscriptionsDivs = <div></div>;
        if (subscriptionsResults.length > 0) {

            const subscriptionsHasSubscriberInfo = subscriptionsResults[0].subscriber;
            const subscriptions = subscriptionsHasSubscriberInfo
                ? subscriptionsResults.sort((subscriptionA, subscriptionB)=>{
                    if (subscriptionA.isAdmin) return -1;
                    if (subscriptionB.isAdmin) return 1;
                    return 0;
                }) : subscriptionsResults;

            subscriptionsDivs = subscriptions.map(subscription =>{
                const { restaurantName: title, restaurantImage: image, restaurantId, restaurantAddress: address, subscriber, email  } = subscription;
                if (subscriber){
                    subscriber.isAdmin = subscription.isAdmin;
                }
                return this.props.getRestaurantDiv(title,'', image, null,restaurantId, address, false, false, subscriber, email);
            })
        }
        return <div>
            <div  id="subscriptions-results">
                <span className="spaced-span">  נמצאו</span>
                {subscriptionsResults.length}
            </div>
            <div className="row">
                {subscriptionsDivs}
            </div>
        </div>
    }
}

export default SubscriptionsTab;

