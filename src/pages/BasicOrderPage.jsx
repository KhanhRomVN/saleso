import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BACKEND_URI } from '~/API'

const BasicOrderPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { checkoutData } = location.state
  const isAPICalled = useRef(false)

  useEffect(() => {
    if (isAPICalled.current) return

    const processCheckoutData = (data) => {
      const sellerMap = new Map()

      // Group by seller_id and adjust deliveryCost
      data.forEach((item) => {
        if (!sellerMap.has(item.seller_id)) {
          sellerMap.set(item.seller_id, [])
        }
        sellerMap.get(item.seller_id).push(item)
      })

      sellerMap.forEach((items, seller_id) => {
        const deliveryCost = items[0].deliveryCost / items.length
        items.forEach((item) => {
          item.deliveryCost = deliveryCost
        })
      })

      return data
    }

    const sendOrder = async (order) => {
      const accessToken = localStorage.getItem('accessToken')
      try {
        const response = await axios.post(
          `${BACKEND_URI}/order/send-order`,
          {
            seller_id: order.seller_id,
            product_id: order.product_id,
            price: order.price,
            quantity: order.quantity,
            address: order.address,
            paymentMethod: order.paymentMethod,
            deliveryMethod: order.deliveryMethod,
            deliveryCost: order.deliveryCost,
          },
          {
            headers: {
              accessToken,
            },
          },
        )
        return response
      } catch (error) {
        console.log(error)
      }
    }

    const processAndSendOrders = async () => {
      try {
        const processedData = processCheckoutData([...checkoutData])
        const promises = processedData.map((order) => sendOrder(order))
        await Promise.all(promises)

        toast.success('Order placed successfully!')
        navigate('/')
      } catch (error) {
        toast.error('An error occurred while placing the order.')
        navigate('/cart')
      }
    }

    processAndSendOrders()
    isAPICalled.current = true
  }, [checkoutData, navigate])

  return <div>Processing your order...</div>
}

export default BasicOrderPage
