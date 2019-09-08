import React, { useEffect, useState } from 'react';
import { Table, Button, PageHeader, Modal } from 'antd';
import Parse from 'parse';
import './message.css';
import _ from 'lodash';

const MessagesListPage = () => {
  const Messages = Parse.Object.extend('messages');
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleModal = (item) => {
    if (!visible) {
      handleStatusMessages(item);
    }
    setVisible(!visible);
  }

  const handleStatusMessages = (item) => {
    if (item.is_read) {
      return;
    }
    setData(data.map((itemData) => {
      if (itemData.key == item.key) {
        itemData.is_read = true;
      }
      return itemData;
    }));
    const query = new Parse.Query(Messages);

    query.get(item.key).then((object) => {
      object.set('is_read', true);
      object.save().then((response) => {
        console.log('Updated messages', response);
      }, (error) => {
        console.error('Error while updating messages', error);
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
      title: 'Usuário',
      dataIndex: 'user.email',
      key: 'user.email',
    },
    {
      title: 'Mensagem',
      key: 'message',
      render: (item) => (
        <div>
          <Button type="primary" onClick={() => handleModal(item)}>
            Abrir mensagem
          </Button>
          <Modal
            title="Mensagem"
            visible={visible}
            onOk={handleModal}
            onCancel={handleModal}
          >
            <p>{item.message}</p>
          </Modal>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'is_read',
      render: (item) => (
        <>
          {isRead(item.is_read)}
        </>
      )
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    }
  ];
  useEffect(() => {
    getAll();
  }, []);

  const isRead = (status) => {
    status = status ? 'read' : 'not-read';
    return <div className={[status, 'cicle'].join(" ")} />
  }

  const getAll = () => {
    const query = new Parse.Query(Messages);
    query.find().then(async results => {
      let messages = [];
      const cb = _.after(results.length, () => {
        setData(messages);
      });
      _.each(results, (result) => {
        let { id, attributes } = result;
        console.log(attributes);
        attributes = { ...attributes };
        attributes.key = id;
        attributes.date = new Date(attributes.createdAt.toString()).toLocaleDateString('pt-BR');

        const messageRelation = result.relation("user_relation");

        messageRelation.query().first().then((messageRelationData) => {
          attributes.user = messageRelationData.attributes;
          attributes.user = { ...attributes.user, key: messageRelationData.id };
          messages = [...messages, attributes];
          cb();
        });
      });
    });
  }


  const routes = [
    {
      path: '',
      breadcrumbName: 'Notícias',
    }
  ];


  return (
    <>
      <PageHeader title="" breadcrumb={{ routes }} />
      <Table columns={columns} dataSource={data} />
    </>
  )
}

export default MessagesListPage;