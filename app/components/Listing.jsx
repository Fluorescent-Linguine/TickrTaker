import React, {Component} from 'react';
import {Link} from 'react-router';
import BidNow from './BidNow.jsx'

// This should be redundant
import {calcTime} from '../helpers.js';

export default class Listing extends Component {
  constructor (props) {
    super(props);
    this.state = {
      status: props.status,
      currentBid: '',
      endDate: ''
    };
  }

  getBids () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/items/bids/' + context.props.item.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var sorted = res.bids.sort(function (a, b) {
          return a.price < b.price;
        });
        context.setState({
          bids: sorted,
          currentBid: sorted[0] ? sorted[0].price : res.endPrice,
        });
      }
    })
  }

  componentWillMount() {    // Set state properties with updated values
    this.getBids();
    this.setState({
      endDate: this.props.item.auctionEndDateByHighestBid,
      timeRemaining: this.calcTime(this.props.item.auctionEndDateByHighestBid)
    });
  }

  componentDidMount () {    //  Set state properties with calculated values
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });

    this.interval = setInterval(() => this.setState({
      timeRemaining: this.calcTime(this.state.endDate)
    }), 1000);
    this.calcTime = this.calcTime.bind(this);
  }

  componentWillUnmount () {    // Clears up DOM elements that were created in ComponentDidMount method
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }

  checkActive () {
    if (this.state.timeRemaining <= 0) {
      this.props.refreshPage();
    }
  }

  // This calculates the time remaining through a helper
  calcTime (endDate) {
    return calcTime(endDate);
  }

  getItem() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/singleitem/' + context.props.item.id,
      headers: {'Content-Type': 'application/json'},
      success: function(res) {
        context.setState({
          endDate: res.auctionEndDateByHighestBid
        });
      }
    })
  }

  render () {
    // var button;

    var itemUrl = '/item/' + this.props.item.id;
    var sellerProfile = '/profile/' + this.props.item.userId;
    var seller = this.props.item.sellerName ? ' '+this.props.item.sellerName : ' Seller'
    return (
      <div className="row">
        <div className="col-sm-3">
          <img className="listing-image" src={this.props.item.picture}></img>
        </div>
        <div className="col-sm-9">
          <Link to={itemUrl}>
            <h3>{this.props.item.title || 'Sample Title'}</h3>
          </Link>
          <div className="row">
            <div className="col-md-7">
              <div>
                Current highest bid:
                <span className="current-price">
                  {' $' + this.state.currentBid}
                </span>
              </div>
              <div>
                Time remaining:
                <span className="time-remaining">
                  {' ' + this.state.timeRemaining}
                </span>
              </div>
              { (this.state.status !== 'forsale' && this.props.auth() ) ?
              <div>
                Seller:
                <Link to={sellerProfile}>
                  <span>
                    { seller }
                  </span>
                </Link>
              </div> : <div></div> }
            </div>
            <div className="col-md-5">
              { this.props.auth() && this.props.bidNowActive ?
                <BidNow
                getItem={this.getItem.bind(this)}
                getBids={this.getBids.bind(this)}
                currentBid={this.state.currentBid}
                item={this.props.item} />
                : <div></div> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}