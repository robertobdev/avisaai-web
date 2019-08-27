import React, { useEffect, useState } from 'react';
import { Table, Divider, Tag } from 'antd';
import Parse from 'parse';
import { Route, Link } from 'react-router-dom';

const NewsListPage = () => {
  const News = Parse.Object.extend('News');
  const query = new Parse.Query(News);
  const [data, setData] = useState([]);
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
          <a>Deletar</a>
        </span>
      ),
    },
  ];
  useEffect(() => {
    query.find().then(results => {
      console.log(results);
      results = results.map(({ id, attributes }) => {
        attributes = { ...attributes };
        attributes.key = id;
        attributes.date = new Date(attributes.createdAt.toString()).toLocaleDateString('pt-BR');
        return attributes;
      })
      setData(results);
    });
  }, []);

  return (
    <Table columns={columns} dataSource={data} />
  )
}

export default NewsListPage;