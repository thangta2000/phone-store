import React, { Component } from 'react'
import { storeProducts, detailProduct } from './data'

const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct: detailProduct,
        cart: [],
        modalOpen: false,
        modalProduct: detailProduct,
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0
    }

    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = { ...item };
            tempProducts = [...tempProducts, singleItem];
        })
        
        this.setState({
            products: tempProducts
        })
    }

    componentDidMount() {
        const newState = JSON.parse(localStorage.getItem('state'));
        if(!newState) this.setProducts();
        else this.setState({
            products: newState.products,
            cart: newState.cart,
            cartSubTotal: newState.cartSubTotal,
            cartTax: newState.cartTax,
            cartTotal: newState.cartTotal
        })
    }

    getItem = id => {
        const product = this.state.products.find(item => item.id === id);
        return product;
    }

    handleDetail = id => {
        const product = this.getItem(id);
        this.setState({
            detailProduct: product
        })
    }

    addToCart = (id) => {
        const product = this.getItem(id);
        product.inCart = true;
        product.count = 1;
        product.total = product.price;
        const newProducts = this.state.products.map(item => {
            return item.id === id ? product : item;
        })
        const newSubTotal = this.state.cartSubTotal + product.total;
        const newTax = parseFloat((newSubTotal / 10).toFixed(2));
        const newTotal = newSubTotal + newTax;
        this.setState({
            products: newProducts,
            cart: [...this.state.cart, product],
            cartSubTotal: newSubTotal,
            cartTax: newTax,
            cartTotal: newTotal
        })
    }

    openModal = id => {
        const product = this.getItem(id);
        this.setState({
            modalProduct: product,
            modalOpen: true
        })
    }

    closeModal = () => {
        this.setState({
            modalOpen: false
        })
    }

    increment = id => {
        const product = this.getItem(id);
        product.count++;
        product.total += product.price;
        const newProducts = this.state.cart.map(item => {
            return item.id === id ? product : item;
        })
        const newSubTotal = this.state.cartSubTotal + product.price;
        const newTax = parseFloat((newSubTotal / 10).toFixed(2));
        const newTotal = newSubTotal + newTax;
        this.setState({
            cart: newProducts,
            cartSubTotal: newSubTotal,
            cartTax: newTax,
            cartTotal: newTotal
        })
    }

    decrement = id => {
        const product = this.getItem(id);
        if (product.count === 1) {
            this.removeItem(id);
            return null;
        }
        product.count--;
        const newProducts = this.state.cart.map(item => {
            return item.id === id ? product : item;
        })
        const newSubTotal = this.state.cartSubTotal - product.price;
        product.total -= product.price;
        const newTax = parseFloat((newSubTotal / 10).toFixed(1));
        const newTotal = newSubTotal + newTax;
        this.setState({
            cart: newProducts,
            cartSubTotal: newSubTotal,
            cartTax: newTax,
            cartTotal: newTotal
        })
    }

    removeItem = id => {
        const product = this.getItem(id);
        product.inCart = false;
        const newProducts = this.state.products.map(item => {
            return item.id === id ? product : item;
        })
        const newCart = this.state.cart.filter(item => {
            return item.id !== id;
        })
        const newSubTotal = this.state.cartSubTotal - product.total;
        const newTax = parseFloat((newSubTotal / 10).toFixed(1));
        const newTotal = newSubTotal + newTax;
        this.setState({
            product: newProducts,
            cart: newCart,
            cartSubTotal: newSubTotal,
            cartTax: newTax,
            cartTotal: newTotal
        })
    }

    clearCart = () => {
        this.state.products.forEach(item => {
            item.inCart = false;
        })
        this.setState({
            products: this.state.products,
            cart: [],
            cartSubTotal: 0,
            cartTax: 0,
            cartTotal: 0
        })
    }

    componentDidUpdate(){
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                clearCart: this.clearCart,
                removeItem: this.removeItem
            }}>
                {this.props.children}
            </ProductContext.Provider >
        )
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
