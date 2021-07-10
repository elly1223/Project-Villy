import React from 'react';
import CartOrder from './CartOrder/CartOrder';
import './Cart.scss';

class Cart extends React.Component {
  render() {
    return (
      <div className="Cart">
        <div className="cartView">
          <header className="cartTop">
            <h1 className="cartTopTitle">장바구니</h1>
            <div className="cartTopButtonWrppaer">
              <button type="button" className="topBtn">
                + 제품추가
              </button>
              <button type="button" className="topBtn">
                삭제
              </button>
            </div>
          </header>

          <CartOrder />
        </div>
      </div>
    );
  }
}

export default Cart;
