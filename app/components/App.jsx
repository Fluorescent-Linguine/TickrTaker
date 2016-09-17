import React, {Component} from 'react';
import Navbar1 from './NavBarUnauth.jsx';
import Navbar2 from './NavBarAuth.jsx';


export default class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isAuth: false,
      user: {}
    };
    this.checkAuthState = this.checkAuthState.bind(this);
  }


  setUser (user) {
    var userStarRating = user.user.numberOfRatings === 0 ? 0 : user.user.sumOfRatings / user.user.numberOfRatings;
    var userEmail = user.user.email || 'please provide email';
    var userAddress = user.user.address || 'please provide address';
    var userPhone = user.user.phone || 'please provide phone number';
    this.setState({
      user: {
        id: user.user.id,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        userEmail: userEmail,
        userPhone: userPhone,
        userAddress: userAddress,
        photo: user.user.photo,
        aboutMe: user.user.aboutMe,
        starRating: userStarRating
      }
    })
  }

  componentWillMount() {   //  Retrieve the data, check if user logged in

    var context = this;
    $.get('/checkLogin').then(function(data) {
      context.setState({
        isAuth: data === 'authenticated'
      });
    }).catch(function(err) {
      context.setState({
        isAuth: false
      });
    });
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        context.setUser(user);
      }
    });
  }

  checkAuthState () {
    return this.state.isAuth;
  }

  render() {   //  Depending on authentication, serves different nav-bar
    var context = this;
    var checkAuthState = this.checkAuthState;
    var navbar = this.state.isAuth ? <Navbar2 /> : <Navbar1 />;
    var children = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {
        auth: checkAuthState,
        user: context.state.user
      });
    });
    return (
      <div>
        {navbar}
        {children}
      </div>
    );
  }
}
