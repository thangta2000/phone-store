import React, { Component } from 'react'
import { ProductConsumer } from '../context'
import { Link } from 'react-router-dom'
import { ButtonContainer } from './Button'

export default class Details extends Component {
   render() {
      return (
         <ProductConsumer>
            {value => {
               const { id, company, img, info, price, title, inCart } = value.detailProduct;
               return (
                  <div className="container py-5">
                     {/*-------------TITLE-------------*/}
                     <div className="row">
                        <div className="col-10 mx-auto text-center text-blue my-4">
                           <h1>{title}</h1>
                        </div>
                     </div>
                     {/*--------------END TITLE--------------*/}
                     {/*--------------PRODUCT INFO-----------*/}
                     <div className="row">
                        <div className="col-md-6 col-10 mx-auto my-3 text-capitalize">
                           <img src={img} alt="product" className="img-fluid" />
                        </div>
                        <div className="col-md-6 col-10 mx-auto my-3 text-capitalize">
                           <h2>model: {title}</h2>
                           <h4 className="text-title text-uppercase text-muted mt-3 mb-2">
                              made by : <span className="text-uppercase">{company}</span>
                           </h4>
                           <h4 className="text-blue">
                              <strong>
                                 price : <span>$</span>{price}
                              </strong>
                           </h4>
                           <p className="text-capitalize font-weight-bold mt-3 mb-0">
                              info about product:
                                    </p>
                           <p className="text-muted lead">{info}</p>
                           <div>
                              <Link to='/'>
                                 <ButtonContainer>back to products</ButtonContainer>
                              </Link>
                              <ButtonContainer
                                 cart
                                 disabled={inCart}
                                 onClick={() => {
                                    value.addToCart(id);
                                    value.openModal(id);
                                 }}
                              >
                                 {inCart ? "inCart" : "add to cart"}
                              </ButtonContainer>
                           </div>
                        </div>
                     </div>
                  </div>
               )
            }}
         </ProductConsumer>
      )
   }
}
