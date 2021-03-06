import React from 'react';
import { Link } from 'react-router-dom';
import { CARTLIST_API, ORDER_API } from '../../../src/config.js';
import './Cart.scss';
class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      cartList: [],
      point: 0,
    };
  }
  responseQuantity = (productID, quantity) => {
    fetch(`${CARTLIST_API}`, {
      method: 'PATCH',
      headers: { Authorization: localStorage.getItem('access_token') },
      body: JSON.stringify({
        productID: productID,
        quantity: quantity,
      }),
    });
  };
  componentDidMount() {
    fetch(`${CARTLIST_API}`, {
      headers: { Authorization: localStorage.getItem('access_token') },
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'INVAILD_USER') {
          this.props.history.push('/login');
        } else {
          this.setState({
            cartList: res.product,
            point: res.point,
          });
          console.log(`res`, res);
        }
      });
  }
  handleIncrement = index => {
    const newCartList = [...this.state.cartList];
    const newQuantity = newCartList[index].quantity + 1;
    newCartList[index] = { ...newCartList[index], quantity: newQuantity };
    this.setState({
      cartList: newCartList,
    });
    this.responseQuantity(this.state.cartList[index].productID, newQuantity);
  };
  handleDecrement = index => {
    const newCartList = [...this.state.cartList];
    const newQuantity = newCartList[index].quantity - 1;
    newCartList[index] = { ...newCartList[index], quantity: newQuantity };
    if (newCartList[index].quantity <= 0) {
      return;
    }
    this.setState({
      cartList: newCartList,
    });
    this.responseQuantity(this.state.cartList[index].productID, newQuantity);
  };
  handleDeleteSelect = idx => {
    const newCartList = this.state.cartList.filter(
      cartList => cartList.productID !== this.state.cartList[idx].productID
    );
    fetch(`${CARTLIST_API}?item=${this.state.cartList[idx].productID}`, {
      method: 'DELETE',
      headers: { Authorization: localStorage.getItem('access_token') },
    }).then(() => this.setState({ cartList: newCartList }));
  };
  handleDeleteAll = () => {
    fetch(`${CARTLIST_API}`, {
      method: 'DELETE',
      headers: { Authorization: localStorage.getItem('access_token') },
    }).then(
      fetch(`${CARTLIST_API}`, {
        headers: { Authorization: localStorage.getItem('access_token') },
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            cartList: res.product,
          });
        })
    );
  };
  order = () => {
    const { cartList } = this.state;
    const orderList = cartList.map(cart => {
      const { productID, quantity } = cart;
      return { productID, quantity };
    });
    fetch(`${ORDER_API}`, {
      method: 'POST',
      headers: { Authorization: localStorage.getItem('access_token') },
      body: JSON.stringify({
        products: { ...orderList },
      }),
    }).then(
      setTimeout(() => {
        this.props.history.push('/order');
      }, 100)
    );
    console.log(`orderList`, orderList);
  };
  render() {
    const { cartList } = this.state;
    const totalPrice = cartList
      .map(cart => cart.productPrice * cart.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const remainedPoint = parseInt(this.state.point - totalPrice);
    if (this.state.cartList.length === 0) {
      return (
        <div className="Cart">
          <div className="cartView">
            <header className="cartTop">
              <h1 className="cartTopTitle">????????????</h1>
              <div className="cartTopButtonWrppaer">
                <Link to="./product">
                  <button type="button" className="topBtn">
                    + ????????????
                  </button>
                </Link>
              </div>
            </header>
            <div className="CartListNull">
              <img
                alt="?????? ????????? ??????"
                className="nullImg"
                src="/images/ListNull.png"
              />
              <h1 className="nullTitle">??????????????? ????????? ????????? ????????????.</h1>
              <p className="nullContent">
                ????????? ??????????????? ?????? <br />
                ????????? ?????? ??????????????? ???????????????.
              </p>
              <Link to="./recommend">
                <button type="submit" className="nullBtn">
                  ????????? ???????????? ??????
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="Cart">
        <div className="cartView">
          <header className="cartTop">
            <h1 className="cartTopTitle">????????????</h1>
            <div className="cartTopButtonWrppaer">
              <Link to="./product">
                <button type="button" className="topBtn">
                  + ????????????
                </button>
              </Link>
              <button
                type="button"
                className="topBtn"
                onClick={this.handleDeleteAll}
              >
                ?????? ??????
              </button>
            </div>
          </header>
          <h2 className="cartListTitle">???????????? ??????</h2>
          <ul className="cartList">
            {cartList &&
              cartList.map(
                (
                  {
                    productID,
                    productName,
                    thumbnail_image_url,
                    productPrice,
                    quantity,
                  },
                  index
                ) => {
                  return (
                    <li className="productList" key={productID}>
                      <div className="cartListImgWrapper">
                        <img
                          alt="?????????"
                          className="cartListImg"
                          src={thumbnail_image_url}
                        />
                      </div>
                      <div className="listDetail">
                        <div className="listTop">
                          <p className="listFont">{productName}</p>
                          <button
                            type="button"
                            className="removeButton"
                            onClick={() => this.handleDeleteSelect(index)}
                          >
                            ??????
                          </button>
                        </div>
                        <br />
                        <div className="countButtonWrppaer">
                          <div className="btnDetail">
                            <button
                              type="button"
                              className="countButton"
                              onClick={() => this.handleDecrement(index)}
                            >
                              -
                            </button>
                            <span className="countNum">{quantity}</span>
                            <button
                              type="button"
                              className="countButton"
                              onClick={() => this.handleIncrement(index)}
                            >
                              +
                            </button>
                          </div>
                          <div className="boxRight">
                            <p className="boxPrice">
                              {(productPrice * quantity).toLocaleString()}???
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
          </ul>
          <div className="cartDetail">
            <div className="productView">
              <div className="productDiscount">
                <p className="discountTitle">?????? ?????? ?????? ?????????</p>
                <p>{parseInt(this.state.point).toLocaleString()}P</p>
              </div>
              <div className="pointDiscount">
                <p>?????? ?????????</p>
                <p>-{totalPrice.toLocaleString()}P</p>
              </div>
            </div>
          </div>
          <div className="cartPrice">
            <p className="totalPriceText">?????? ?????????</p>
            <p className="totalPrice">{remainedPoint.toLocaleString()}P</p>
          </div>
          <div className="cartFooterButtonWrppaer">
            <button type="submit" className="resultBtn" onClick={this.order}>
              ????????????
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Cart;
