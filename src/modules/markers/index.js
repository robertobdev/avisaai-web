import React, { useEffect, useState } from 'react';
import { Table, Divider, Tag, Popconfirm, message, Button } from 'antd';
import Parse from 'parse';
import { Link } from 'react-router-dom';
import './markers.css';
import _ from 'lodash';

const MarkersListPage = () => {
  const Markers = Parse.Object.extend('Markers');
  const query = new Parse.Query(Markers);
  const [data, setData] = useState([]);
  const handleConfirm = (key) => {
    query.get(key).then((object) => {
      object.destroy().then((response) => {
        getAll();
        console.log('Deleted Markers', response);
      }, (error) => {
        console.error('Error while deleting Markers', error);
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
      title: 'Lugar',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Tipo',
      dataIndex: 'type.description',
      key: 'type.parent.id',
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
          <Link to={`/panel/markers/add/${news.key}`}>
            Editar
          </Link>
          <Divider type="vertical" />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleConfirm(news.key)}
            okText="Sim"
            cancelText="Não"
          >
            <a href="#">Deletar</a>
          </Popconfirm>
        </span>
      ),
    },
  ];
  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    const query = new Parse.Query(Markers);
    query.find().then(async results => {
      let markers = [];
      const cb = _.after(results.length, () => {
        setData(markers);
      });
      _.each(results, (result) => {
        let { id, attributes } = result;
        attributes = { ...attributes };
        attributes.key = id;
        attributes.date = new Date(attributes.createdAt.toString()).toLocaleDateString('pt-BR');
        
        const type = result.relation("type_relation");

        type.query().first().then((type) => {
          attributes.type = type.attributes;
          attributes.type = { ...attributes.type, key: type.id };
          markers = [...markers, attributes];
          cb();
        });
      });
    });
  }

  return (
    <>
      <Button>
        <Link to={`/panel/markers/add/`}>
          Nova Marcação
        </Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

export default MarkersListPage;