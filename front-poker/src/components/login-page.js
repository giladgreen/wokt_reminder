import React, { Component } from 'react';
import getSubscriptions from '../actions/getSubscriptions';
import FacebookLogin from  'react-facebook-login/dist/facebook-login-render-props';
const GOOGLE_CLIENT_ID= '79744445247-r6hecpeic6csggbl5c40isiqfshf15l7.apps.googleusercontent.com';
const FACEBOOK_APP_ID= '4683699325055690';
import { GoogleLogin } from 'react-google-login';

class LoginPage extends Component {

    performLogin = async (provider, token) => {
        try{
            const {subscriptions, userContext} = await getSubscriptions(provider, token);
            this.props.setState({ subscriptions, email: userContext.email, thinking:false });
            const issueDate  = new Date();
            localStorage.setItem('authData', JSON.stringify({provider, token, issueDate }));
            localStorage.setItem('email', userContext.email);
            this.props.onLoggedIn();
        } catch(error) {
            localStorage.removeItem('authData');
            console.log('error', error)
            alert('failed to login');
            this.props.setState({ thinking:false });
        }
    };

    googleResponse = (response) => {
        if (response.accessToken){
            this.performLogin('google', response.accessToken);
        }else{
            console.error('google login failure');
        }

    };
    facebookResponse = (response) => {
        if (response.accessToken){
            this.performLogin('facebook', response.accessToken);
        }else{
            console.error('facebook login failure');
        }

    };
    render() {//setState, onLoggedIn
            return <div id="login-page">
                <div id="login-page-header">
                    התחברות
                </div>
                <div id="login-body">
                    <div>
                        <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        onSuccess={this.googleResponse}
                        onFailure={this.onLoginFailure}
                        render={renderProps => (
                            <div className="login-button login-button-google" onClick={renderProps.onClick}> התחבר באמצעות גוגל</div>
                        )}
                    />
                    </div>
                    <div>
                        <FacebookLogin
                        disableMobileRedirect={true}
                        appId={FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields="name,email"
                        callback={this.facebookResponse}
                        render={renderProps => (
                            <div id="fbButton" className="login-button login-button-fb" onClick={renderProps.onClick}> התחבר באמצעות פייסבוק</div>
                        )}/>
                    </div>
                </div>
                <div id="explained">
                    <div id="explained-header">
                        <hr/>
                        ככה זה עובד:
                        <hr/>
                    </div>
                    <div className="row">
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                כשמחפשים מסעדה בוולט
                            </div>
                            <div className="explained-sub-header">
                                 היא לפעמים סגורה
                            </div>
                            <div >
                                <img src="./wolt1.jpeg"/>
                            </div>
                        </div>
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                אבל אם נכנסים רואים שזה רק זמני
                            </div>
                            <div >
                                <img src="./wolt2.jpeg"/>
                            </div>
                        </div>
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                אז מחפשים את המסעדה פה באתר
                            </div>
                            <div className="explained-sub-header">
                                ונרשמים לעדכון עבורה
                            </div>
                            <div >
                                <img src="./wolt3.jpeg"/>
                            </div>
                        </div>
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                וכשהמסעדה נפתחת מקבלים עדכון במייל
                            </div>

                            <div >
                                <img src="./wolt4.jpeg"/>
                            </div>
                        </div>
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                ואז נכנסים שוב ומזמינים רגיל דרך הוולט
                            </div>
                            <div >
                                <img src="./wolt5.jpeg"/>
                            </div>
                        </div>
                        <div className="col-xs-4 ">
                            <div className="explained-sub-header">
                                האתר לא קשור בשום צורה לחברת וולט,
                            </div>
                            <div className="explained-sub-header">
                                וכנראה יירד כשהם יתמכו באפשרות הזאת בעצמם
                            </div>
                            <div className="explained-sub-header email-address">
                                green.gilad@gmail.com
                            </div>

                        </div>
                    </div>
                </div>
            </div>

    }
}

export default LoginPage;

