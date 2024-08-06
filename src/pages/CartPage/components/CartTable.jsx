import React, { useState } from 'react'
import { Table, InputNumber, Checkbox, Image, Card } from 'antd'

const CartTable = ({ cartData, onQuantityChange }) => {
  const [selectedItems, setSelectedItems] = useState([])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={selectedItems.includes(record.productId)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, record.productId])
              } else {
                setSelectedItems(selectedItems.filter((id) => id !== record.productId))
              }
            }}
          />
          <span style={{ marginLeft: 8 }}>{index + 1}</span>
        </div>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={product.image}
            alt={product.name}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px', marginRight: '16px' }}
          />
          <span>{product.name}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'product',
      key: 'price',
      render: (product) => {
        if (product.price && product.price.min !== undefined && product.price.max !== undefined) {
          return `$${product.price.min} - $${product.price.max}`
        } else if (product.price && product.price.min !== undefined) {
          return `$${product.price.min}`
        } else {
          return 'N/A'
        }
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.product.stock}
          value={quantity}
          onChange={(value) => onQuantityChange(record.productId, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (_, record) => {
        const price = record.product.price ? record.product.price.min : 0
        return `$${(price * record.quantity).toFixed(2)}`
      },
    },
  ]

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={cartData.items.map((item, index) => ({
          key: item.productId,
          index: index + 1,
          ...item,
        }))}
        pagination={false}
      />
    </Card>
  )
}

export default CartTable
