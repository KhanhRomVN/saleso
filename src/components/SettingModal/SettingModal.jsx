import React, { useState } from 'react'
import { Modal, Menu, Tabs } from 'antd'
import {
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ShopOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import GeneralSettings from './components/GeneralSettings'
import LocationSettings from './components/LocationSettings'
import CardSettings from './components/CardSettings'
import SellerSettings from './components/SellerSettings'
import OrderSettings from './components/OrderSettings'

const { TabPane } = Tabs

const SettingModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('general')

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  return (
    <Modal visible={visible} onCancel={onClose} width={800} footer={null} title="Settings">
      <Tabs activeKey={activeTab} onChange={handleTabChange} tabPosition="left">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              General
            </span>
          }
          key="general"
        >
          <GeneralSettings />
        </TabPane>
        <TabPane
          tab={
            <span>
              <EnvironmentOutlined />
              Location
            </span>
          }
          key="location"
        >
          <LocationSettings />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CreditCardOutlined />
              Card
            </span>
          }
          key="card"
        >
          <CardSettings />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Seller
            </span>
          }
          key="seller"
        >
          <SellerSettings />
        </TabPane>
        <TabPane
          tab={
            <span>
              <OrderedListOutlined />
              Order
            </span>
          }
          key="order"
        >
          <OrderSettings />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default SettingModal
