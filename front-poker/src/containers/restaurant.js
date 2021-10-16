import React from 'react';

const Restaurant = (props) => {
    const offline = !props.isOpen;
    const subscriptionPage = !props.searchPage;
    return <div key={`rest_${props.searchPage}_${props.restaurantId}`} className={`col-xs-6 restaurant-result-div ${offline ?'offline':''} ${ isMobile ? 'mobile-width' : ''}`} onClick={()=> offline && props.searchPage ? props.subscribe(props.title, props.restaurantId) : subscriptionPage ? props.unsubscribe(props.title, props.restaurantId) : ()=>{}}>
        <div> <img src={props.image}/></div>
        <div className="rest-data">
            <div className="restaurant-title">{props.title}</div>
            <div className="restaurant-short-description">{props.shortDescription}</div>

            <div className="restaurant-address">{props.address}</div>
            {props.overlay && props.overlay.length ? <div className="overlay">{props.overlay}</div> : <span></span>}
            {offline && props.searchPage ? <div className="action-prompt">לחץ לרישום</div>: <span></span> }
            {subscriptionPage  ? <div className="action-prompt">להסרת רישום</div>: <span></span> }
            {props.subscriber ? <div>
                <div> { props.subscriber.firstName} { props.subscriber.familyName}</div>
                <div className="email-data">({props.subscriber.email})</div>
                <div> <img src={ props.subscriber.imageUrl}/></div>
            </div>:<div></div>}
        </div>
    </div>
}

export default Restaurant;
