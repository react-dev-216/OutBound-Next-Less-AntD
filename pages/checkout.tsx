import React, { useState } from 'react'
import { TravelCloudClient, Cart, TcResponse } from 'travelcloud-antd'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Customer, Order as OrderType } from 'travelcloud-antd/types'
import { Card } from 'antd'
import { Order } from 'travelcloud-antd/components/order'

var cart = null

const CheckoutPage: NextPage = () => {
  const router = useRouter()

  const [order, setOrder] = useState<TcResponse<OrderType>>({ loading: true })
  const [customer, setCustomer] = useState<TcResponse<Customer>>({ loading: true })

  const client = new TravelCloudClient({
    tcUser: 'edge2',
    defaultTitle: '',
    companyName: ''})

  if (process.browser && cart == null) cart = new Cart({
    client,
    onOrderChange: (order) => {setOrder(order)},
    onCustomerChange: (customer) => setCustomer(customer),
  })

  if (order.loading) {
    return <div style={{minHeight: 1000, backgroundColor: '#fff', margin: '64px auto', padding: 64, maxWidth: 1600}}>
      <Card loading={true} style={{border: 0}}></Card>
    </div>
  }

  if (order == null || order.result.products == null || order.result.products.length === 0) {
    return <div style={{minHeight: 1000, backgroundColor: '#fff', margin: '64px auto', padding: 64, maxWidth: 1600}}>
      <h1>Your cart is empty</h1>
    </div>
  }


  return <div>
    <Order order={order.result} showSection={{products: true}} cart={cart} />
  </div>
}

export default CheckoutPage
