import React, { useState, Component } from 'react';
import { Layout, Menu, Icon, Popconfirm } from 'antd';
import './layout.css';
import NewsPage from '../../modules/news/index';
import MarkersPage from '../../modules/markers/index';
import NewsAddPage from '../../modules/news/save/index';
import MarkerAddPage from '../../modules/markers/save/index';
import { Route, Link, withRouter } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

const SiderDemo = withRouter(({ history }) => {

  const [collapsed, setCollapsed] = useState(false);
  const renderRoutedComponent = (_component, props) => {
    return <_component props={props} />;
  }
  const handleLogout = () => {
    localStorage.clear();
    history.push('/');
  }
  return (
    <Layout className="layout-panel">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/panel/news">
              <Icon type="read" />
              <span>Notícias</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="pushpin" />
            <span>Marcações do Mapa Interativo</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="upload" />
            <Popconfirm
              onConfirm={handleLogout}
              title="Você deseja sair？"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            >
              <span href="#">Sair</span>
            </Popconfirm>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          <Route
            exact
            path="/panel/news/"
            render={() => renderRoutedComponent(NewsPage)} />
          <Route
            exact
            path="/panel/news/add/:id"
            render={(props) => renderRoutedComponent(NewsAddPage, props)} />
          <Route
            exact
            path="/panel/news/add"
            render={(props) => renderRoutedComponent(NewsAddPage, props)} />
          <Route
            exact
            path="/panel/markers/"
            render={() => renderRoutedComponent(MarkersPage)} />
          <Route
            exact
            path="/panel/markers/add/:id"
            render={(props) => renderRoutedComponent(MarkerAddPage, props)} />
          <Route
            exact
            path="/panel/markers/add"
            render={(props) => renderRoutedComponent(MarkerAddPage, props)} />
        </Content>
      </Layout>
    </Layout>
  );
});

export default SiderDemo;