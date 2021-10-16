import React, { Component } from 'react';
import getSearchResults from './actions/getSearchResults';
import subscribeRestaurant from './actions/subscribeRestaurant';
import unsubscribeRestaurant from './actions/unsubscribeRestaurant';
import getSubscriptions from './actions/getSubscriptions';
import getLocationData from './actions/getLocationData';
import Restaurant from './containers/restaurant';
import ShowAlert from './containers/ShowAlert';
import LoginPage from './components/login-page';
import SearchTab from './components/search-tab';
import SubscriptionsTab from './components/subscriptions-tab';

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const LAT_DEFAULT = '32.083758287943694';
const LON_DEFAULT = '34.79441564530133';
const location = {
    lat: localStorage.getItem('lat') || LAT_DEFAULT,
    lon: localStorage.getItem('lon') || LON_DEFAULT,
    details: localStorage.getItem('address-details') || '',
}

function getLocation(){
    console.log('getLocation',location)
    if (navigator.geolocation)
    {
        console.log('navigator.geolocation enabled')
        navigator.geolocation.getCurrentPosition(async (position)=>{
            console.log('got position.',position)
            const changed = (`${location.lat}` !== `${position.coords.latitude}` || `${location.lon}` !== `${position.coords.longitude}`);
            console.log('changed',changed)
            location.lat=position.coords.latitude;
            location.lon=position.coords.longitude;
            localStorage.setItem('lat', location.lat);
            localStorage.setItem('lon', location.lon);
            //if (changed) {
                const addressDetails = await getLocationData(location.lat, location.lon);
                location.details = addressDetails;
                this.setState({ myAddress: addressDetails });
            //}else{
              //  this.setState({ myAddress: location.details });
           // }
        },(err)=>{
            console.log('calling getCurrentPosition got error:', err)
        });
    }
    else{
        console.log('no navigator.geolocation')
    }
}

class App extends Component {

    constructor() {
        super();
        setTimeout(async ()=>{
            const authData = localStorage.getItem('authData');
            if (authData){
                const {provider, token } = JSON.parse(authData);
                if (provider && token) {
                    const { subscriptions, userContext } = await getSubscriptions(provider, token);
                    console.log('after getSubscriptions')
                    this.setState({ subscriptions, email: userContext.email });
                    this.onLoggedIn();
                }
            }
        },400);

        this.state = {
            email: null,
            results:[],
            subscriptions:[],
            tabKey:'search',
            searchWasClicked: false,
            thinking: false,
            myAddress: '',
            alertMessage: null,
        };
    }
    showAlert = (alertMessage) =>{
        this.setState({alertMessage});
        setTimeout(()=>{
            this.setState({alertMessage: null});
        },2000)
    }
    onLoggedIn = () =>{
        getLocation.bind(this)();
    }
    onAddressReset = ()=>{
        localStorage.removeItem('lat');
        localStorage.removeItem('lon');
        localStorage.removeItem('address-details');
        location.lat = LAT_DEFAULT;
        location.lon = LON_DEFAULT;
        this.onLoggedIn();
    }
    subscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));
        setImmediate(async ()=>{
            const subscriptions = await subscribeRestaurant(name, restaurantId, location, provider, token);
            setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
            this.showAlert('הרישום בוצע בהצלחה')
        })
    }

    unsubscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));
        setImmediate(async ()=>{
            if (confirm("להסיר את הרישום?")){
                const subscriptions = await unsubscribeRestaurant(name, restaurantId, location, provider, token);
                setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
                this.showAlert('הרישום הוסר')
            }else{
                setState({ thinking:false });
            }
        })
    }

    search = async(searchTerm) => {
        if (!searchTerm || searchTerm.length ===0){
            return;
        }
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        setImmediate(async ()=>{
            localStorage.setItem('searchRestaurantValue', searchTerm);
            const results = await getSearchResults(searchTerm, location);
            setState({ results, searchWasClicked:true, thinking:false });
        })
    }

    getRestaurantDiv = (title,shortDescription, image, overlay,restaurantId, address, isOpen, searchPage, subscriber, email)=>{
        return <Restaurant
            title={title}
            shortDescription={shortDescription}
            image={image}
            overlay={overlay}
            restaurantId={restaurantId}
            address={address}
            isOpen={isOpen}
            searchPage={searchPage}
            subscriber={subscriber}
            email={email}
            subscribe={this.subscribe.bind(this)}
            unsubscribe={this.unsubscribe.bind(this)}
        />
    }
    onKeyChange = (tabKey)=>{
        this.setState({tabKey });
    };

    onDisconnect = () =>{
        localStorage.removeItem('email');
        this.setState({ email: null, alertMessage: 'התנתקת'});
        setTimeout(()=>{
            this.setState({alertMessage: null});
        },2000)
    }

    render() {
        const loggedIn = Boolean(this.state.email);
        console.log('loggedIn',loggedIn)
        return (
            <div>
                {!loggedIn && <LoginPage setState={this.setState.bind(this)} onLoggedIn={this.onLoggedIn.bind(this)} showAlert={this.showAlert.bind(this)}/>}
                {loggedIn && <div>
                                    <div id="login-data">
                                        <div>{this.state.email}</div>
                                        <div> <span id="log-out-button" onClick={this.onDisconnect}>התנתקות</span></div>
                                    </div>
                                    <div id="main-header">
                                       <u>תוסף לוולט</u>
                                    </div>
                                    <div id="secondary-header">
                                           הירשמו לקבל התראה כשמסעדה נפתחת למשלוחים
                                    </div>
                                    <Tabs defaultActiveKey="search" id="uncontrolled-tab-example" style={{fontSize: isMobile ? "0.8em" : "1em"}} activeKey={this.state.tabKey} onSelect={this.onKeyChange} variant="pills">
                                        <Tab eventKey="search" title="חיפוש מסעדות" >
                                            <SearchTab search={this.search.bind(this)}
                                                       myAddress={this.state.myAddress}
                                                       onAddressReset={this.onAddressReset.bind(this)}
                                                       searchWasClicked={this.state.searchWasClicked}
                                                       results={this.state.results}
                                                       getRestaurantDiv={this.getRestaurantDiv.bind(this)}/>

                                        </Tab>
                                        <Tab eventKey="subscriptions" title="רישומים" >
                                           <SubscriptionsTab subscriptions={this.state.subscriptions}
                                                             getRestaurantDiv={this.getRestaurantDiv.bind(this)}/>
                                        </Tab>
                                    </Tabs>
                            </div>}
                {this.state.alertMessage && <ShowAlert message={this.state.alertMessage}/>}
                {this.state.thinking && <div className="sivivator"> <img id="sivivator-gif" src='loading.gif'/></div>}
            </div>);
    }
}

export default App;

