import React, { useEffect, useState } from 'react';
import { Table, Divider, Popconfirm, Button, PageHeader} from 'antd';
import Parse from 'parse';
import { Link } from 'react-router-dom';
import './notifications.css';
import _ from 'lodash';

const NotificationListPage = () => {
  const Notification = Parse.Object.extend('Notification');
  const query = new Parse.Query(Notification);
  const [data, setData] = useState([]);
  const handleConfirm = (key) => {
    query.get(key).then((object) => {
      object.destroy().then((response) => {
        getAll();
        console.log('Deleted Notification', response);
      }, (error) => {
        console.error('Error while deleting Notification', error);
      });
    });
  }
  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Noticía',
      dataIndex: 'news.title',
      key: 'news.parent.id',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (notification) => (
        <span>
          <Link to={`/panel/notifications/add/${notification.key}`}>
            Editar
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleConfirm(notification.key)}
            okText="Sim"
            cancelText="Não"
          >
            <a href="/">Deletar</a>
          </Popconfirm>
        </span>
      ),
    },
  ];
  // eslint-disable-next-line
  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    const query = new Parse.Query(Notification);
    query.find().then(async results => {
      let notifications = [];
      const cb = _.after(results.length, () => {
        setData(notifications);
      });
      _.each(results, (result) => {
        let { id, attributes } = result;
        attributes = { ...attributes };
        attributes.key = id;
        attributes.date = new Date(attributes.createdAt.toString()).toLocaleDateString('pt-BR');
        
        const newsRelation = result.relation("news_relation");

        newsRelation.query().first().then((newsRelationData) => {
          attributes.news = newsRelationData.attributes;
          attributes.news = { ...attributes.news, key: newsRelationData.id };
          notifications = [...notifications, attributes];
          cb();
        });
      });
    });
  }
  
  const routes = [
    {
      path: '',
      breadcrumbName: 'Notificações',
    }
  ];


  return (
    <>
      <PageHeader title="" breadcrumb={{ routes }} />
      <Button>
        <Link to={`/panel/notifications/add/`}>
          Nova Notificação
        </Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

export default NotificationListPage;