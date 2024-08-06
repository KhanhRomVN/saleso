import React from 'react'
import { Layout, Row, Col, Typography, Space, Input, Button, QRCode, Image, useToken } from 'antd'
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons'

const { Footer } = Layout
const { Title, Text, Paragraph } = Typography

const AppFooter = () => {
  const { token } = useToken()

  const footerSections = [
    {
      title: 'Exclusive',
      content: (
        <>
          <Paragraph>Subscribe</Paragraph>
          <Paragraph>Get 10% off your first order</Paragraph>
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 70px)' }} placeholder="Enter your email" />
            <Button type="primary">Send</Button>
          </Input.Group>
        </>
      ),
    },
    {
      title: 'Support',
      content: (
        <>
          <Paragraph>Asia, Viet Nam</Paragraph>
          <Paragraph>saleso@gmail.com</Paragraph>
          <Paragraph>+1800-0909</Paragraph>
        </>
      ),
    },
    {
      title: 'Account',
      items: ['My Account', 'Login / Register', 'Cart', 'WishList', 'Shop'],
    },
    {
      title: 'Quick Link',
      items: ['Privacy Policy', 'Terms of Use', 'FAQ', 'Contact'],
    },
    {
      title: 'Download App',
      content: (
        <>
          <QRCode value="https://example.com" size={100} />
          <Space>
            <Image width={100} src="/path-to-google-play-badge.png" alt="Google Play" />
            <Image width={100} src="/path-to-app-store-badge.png" alt="App Store" />
          </Space>
          <Space>
            <FacebookOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
            <TwitterOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
            <InstagramOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
            <LinkedinOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
          </Space>
        </>
      ),
    },
  ]

  return (
    <Footer
      style={{
        backgroundColor: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        padding: token.padding * 4,
      }}
    >
      <Row gutter={[token.marginLG, token.marginLG]} justify="space-around">
        {footerSections.map((section, index) => (
          <Col key={index} xs={24} sm={12} md={4}>
            <Title level={4} style={{ color: token.colorTextHeading }}>
              {section.title}
            </Title>
            {section.items ? (
              <Space direction="vertical">
                {section.items.map((item, itemIndex) => (
                  <Text
                    key={itemIndex}
                    style={{
                      color: token.colorTextSecondary,
                      cursor: 'pointer',
                      '&:hover': {
                        color: token.colorPrimary,
                      },
                    }}
                  >
                    {item}
                  </Text>
                ))}
              </Space>
            ) : (
              section.content
            )}
          </Col>
        ))}
      </Row>
    </Footer>
  )
}

export default AppFooter
