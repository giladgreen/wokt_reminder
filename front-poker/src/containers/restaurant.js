import React, { Component } from 'react';

const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

class Restaurant extends Component {
    render() {
        const offline = !this.props.isOpen;
        const subscriptionPage = !this.props.searchPage;
        return <div key={`rest_${this.props.searchPage}_${this.props.restaurantId}`} className={`col-xs-6 restaurant-result-div ${offline ?'offline':''} ${ isMobile ? 'mobile-width' : ''}`} onClick={()=> offline && this.props.searchPage ? this.props.subscribe(this.props.title, this.props.restaurantId) : subscriptionPage ? this.props.unsubscribe(this.props.title, this.props.restaurantId) : ()=>{}}>
            <div> <img src={this.props.image}/></div>
            <div className="rest-data">
                <div className="restaurant-title">{this.props.title}</div>
                <div className="restaurant-short-description">{this.props.shortDescription}</div>

                <div className="restaurant-address">{this.props.address}</div>
                {this.props.overlay && this.props.overlay.length ? <div className="overlay">{this.props.overlay}</div> : <span></span>}
                {offline && this.props.searchPage ? <div className="action-prompt">לחץ לרישום</div>: <span></span> }
                {subscriptionPage  ? <div className="action-prompt">להסרת רישום</div>: <span></span> }
                {this.props.subscriber ? <div>
                    <div> { this.props.subscriber.firstName} { this.props.subscriber.familyName}</div>
                    <div className="email-data">({this.props.subscriber.email})</div>
                    <div> <img src={ this.props.subscriber.imageUrl}/></div>
                </div>:<div></div>}
            </div>
        </div>

    }
}

export default Restaurant;

