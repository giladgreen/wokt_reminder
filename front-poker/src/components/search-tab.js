import React, { Component } from 'react';

class SearchTab extends Component {
    constructor() {
        super();
        const searchRestaurantValue = localStorage.getItem('searchRestaurantValue') || '';
        this.state = {
            searchRestaurantValue,
        };
    }
    onSearchRestaurantValueChange = (event) => {
        this.setState({ searchRestaurantValue: event.target.value });
    }
    render() {
        return  <div>
            <div id="search-restaurant-div">
                <input type="text" id="search-restaurant-input" value={this.state.searchRestaurantValue} onChange={this.onSearchRestaurantValueChange} onKeyDown={(e)=>{
                    console.log('e.key',e.key)
                    if (e.key === 'Enter') {
                        this.props.search(this.state.searchRestaurantValue)
                    }
                }}/>
                <button id="search-restaurant-button"  onClick={()=>this.props.search(this.state.searchRestaurantValue)} disabled={this.state.searchRestaurantValue.length === 0}>חיפוש</button>
            </div>
            <div id="my-address-div">
                {this.props.myAddress ? <span id="address-info-text">חיפוש על פי הכתובת: {this.props.myAddress}  </span> : <span></span> }
                {this.props.myAddress ? <span id="reset-address" onClick={()=>{
                    localStorage.removeItem('lat');
                    localStorage.removeItem('lon');
                    localStorage.removeItem('address-details');
                    this.props.onLoggedIn();
                }
                }>אפס</span> : <span></span>}
            </div>
            <div id="search-results">
                { this.props.searchWasClicked ? <div>
                    <span className="spaced-span">  נמצאו</span>
                    {this.props.results.length}

                    <span className="spaced-span">  תוצאות</span>
                </div> : <div></div>}
                <div className="row">
                    {
                        this.props.results.map((result) =>{
                            const {title, image: {url: image}, overlay, track_id: restaurantId, venue: { address, short_description}, isOpen }= result;
                            return this.props.getRestaurantDiv(title, short_description, image, overlay,restaurantId, address, isOpen, true);
                        })
                    }
                </div>
            </div>
        </div>

    }
}

export default SearchTab;

