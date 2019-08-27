import React, { useEffect, useState } from 'react';
import { Table, Divider, Popconfirm, Button, PageHeader } from 'antd';
import Parse from 'parse';
import { Link } from 'react-router-dom';
import './news.css';

const NewsListPage = () => {
  const News = Parse.Object.extend('News');
  const query = new Parse.Query(News);
  const [data, setData] = useState([]);
  const handleConfirm = (key) => {
    query.get(key).then((object) => {
      object.destroy().then((response) => {
        getAll();
        console.log('Deleted News', response);
      }, (error) => {
        console.error('Error while deleting News', error);
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
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (news) => (
        <span>
          <Link to={`/panel/news/add/${news.key}`}>
            Editar
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleConfirm(news.key)}
            okText="Sim"
            cancelText="Não"
          >
            <a href="/">Deletar</a>
          </Popconfirm>
        </span>
      ),
    },
  ];
  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    const query = new Parse.Query(News);
    query.find().then(results => {
      results = results.map(({ id, attributes }) => {
        attributes = { ...attributes };
        attributes.key = id;
        attributes.date = new Date(attributes.createdAt.toString()).toLocaleDateString('pt-BR');
        return attributes;
      })
      setData(results);
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
      <Button>
        <Link to={`/panel/news/add/`}>
          Nova notícia
        </Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

export default NewsListPage;