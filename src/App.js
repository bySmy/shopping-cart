import React from 'react';
import Cart from './components/Cart';
import Filter from './components/Filter';
import Products from './components/Products';
import { Provider } from "react-redux";
import data from "./data.json";
import store from "./store";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      products: data.products,
      cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
      size: "",
      sort: "",
    };
    
  }

  createOrder = (order) => {
    alert("Need to save order for " + order.name);
  };

  removeFromCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    this.setState({
      cartItems: cartItems.filter((item) => item._id !== product._id),
    });
    localStorage.setItem("cartItems",JSON.stringify(cartItems.filter((item) => item._id !== product._id)));

  };


  addToCart = (product) => {
    const cartItems = this.state.cartItems.slice();
    let isInCart = false;
    cartItems.forEach((item) => {
      if(item._id === product._id){
        isInCart = true;
        item.count++; 
      }
    });

    if(!isInCart) {
      cartItems.push ({...product, count: 1});
    }

    this.setState({cartItems});

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  filterProducts = (event) => {
    if(event.target.value === "all"){
      this.setState({size:event.target.value, products:data.products});
    } else {
      this.setState({
        size: event.target.value,
        products: data.products.filter((product) => 
                  product.availableSizes.indexOf(event.target.value) >=0
        ),
      });
    }
  };

  sortProducts = (event) => {
    const sortItem = event.target.value;
   
    // if( sortItem === "latest"){
    //   this.setState({sort:sortItem, products:data.products.sort((a, b) => (a._id > b._id ? 1 : -1))});
    // } else {
    this.setState((state) => ({
      sort: sortItem,
      products: this.state.products
        .slice()
        .sort((a,b) => {
           if(sortItem === "lowest"){
              return a.price - b.price;
           }else if (sortItem === "highest"){
              return b.price - a.price;
           }else{
             return b._id - a._id;
           }
           
        })     
    }));
  };

  render (){
    return (
      <Provider store= {store}>
       <div className="grid-container">
        <header>
         <a href="/">Shopping Cart</a>
        </header>
        <main>
          <div className= "content">
             <div className= "mainbar">
               <Filter count={this.state.products.length}
                      size={this.state.size}
                      sort={this.state.sort}
                      filterProducts={this.filterProducts}
                      sortProducts={this.sortProducts}></Filter>
                <Products products={this.state.products}
                          addToCart={this.addToCart}></Products>
             </div>
             <div className= "sidebar">
               <Cart cartItems={this.state.cartItems}
                     removeFromCart={this.removeFromCart}
                     createOrder= {this.createOrder}  />
             </div>
          </div>
        </main>
       <footer>All right is reserved</footer>
      </div>
     </Provider>
    );
  }
}

export default App;
