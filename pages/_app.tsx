import '../customize/styles.less'
import Head from 'next/head'
import Link from 'next/link'
import * as React from 'react'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { Col, Drawer, Icon, Layout, Menu, Row } from 'antd'
import { CeecLogo } from '../components/custom-svg'
import config from '../customize/config'

const { Header, Footer, Content } = Layout

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {

  const [ menuVisible, setMenuVisible ] = useState(false)

  const mainMenu = (mode, theme?) => {
    return (
      <Menu
        mode={mode}
        theme={theme || "light"}
      >
        <Menu.Item key="featured-tours">
          <Link href="/featured-tours" passHref>
            <a>Featured Tours</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="places-of-interest">
          <Link href="/places-of-interest" passHref>
            <a>Places of Interest</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="about-experiencee">
          <Link href="/about-experiencee" passHref>
            <a>About ExperienCEE</a>
          </Link>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <Layout>
      <Header>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>CEEC</title>
        </Head>
        <Row type="flex" gutter={20} justify="space-between" align="middle">
          <Link href="/" passHref>
            <a><CeecLogo /></a>
          </Link>
          {mainMenu("horizontal", "dark")}
          <a className="menu-trigger" onClick={() => setMenuVisible(true)}>
            <Icon type="menu" style={{ fontSize: 20 }} />
          </a>
        </Row>
        <Drawer
          visible={menuVisible}
          closable={true}
          onClose={() => setMenuVisible(false)}
          title={"Welcome"}
          width="100%"
          bodyStyle={{ padding: 0 }}
        >
          {mainMenu("vertical")}
        </Drawer>
      </Header>
      <Content>
        <Component {...pageProps} />
      </Content>
      <Footer>
        <div className="wrap pad-y">
          <Row type="flex">
            <Col xs={24} md={8} style={{ marginBottom: 24 }}>
              <CeecLogo />
              <br />
              <Row type="flex" gutter={12} align="middle" className="social">
                <a target="_blank" href={config.facebook}><Col><img src="/img/circ-icon-fb.png" height={50} /></Col></a>
                <a target="_blank" href={config.instagram}><Col><img src="/img/circ-icon-ig.png" height={50} /></Col></a>
                <a target="_blank" href={config.whatsapp}><Col><img src="/img/circ-icon-wa.png" height={50} /></Col></a>
              </Row>
            </Col>
            <Col xs={24} md={8} style={{ marginBottom: 24 }}>
              <h4>Browse</h4>
              <Link href="/featured-tours" passHref><a><div>Featured Tours</div></a></Link>
              <Link href="/places-of-interest" passHref><a><div>Places of Interest</div></a></Link>
              <Link href="/about-experiencee" passHref><a><div>About experienCEE</div></a></Link>
            </Col>
            <Col xs={24} md={8} style={{ marginBottom: 24 }}>
              <h4>Need Quick Answers?</h4>
              <Link href="/faq" passHref><a><div>FAQ</div></a></Link>
              <Link href="/chat" passHref><a><div>Chat with us</div></a></Link>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  )
}