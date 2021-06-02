import React, { Fragment } from 'react';
import { render } from 'react-dom';
import ReactDatatable from '@ashvin27/react-datatable';

class IncidentTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        key: "name",
        text: "Name",
        className: "name",
        align: "left",
        sortable: true,
      },
      {
        key: "address",
        text: "Address",
        className: "address",
        align: "left",
        sortable: true
      },
      {
        key: "postcode",
        text: "Postcode",
        className: "postcode",
        sortable: true
      },
      {
        key: "rating",
        text: "Rating",
        className: "rating",
        align: "left",
        sortable: true
      },
      {
        key: "type_of_food",
        text: "Type of Food",
        className: "type_of_food",
        sortable: true,
        align: "left"
      },
      {
        key: "action",
        text: "Action",
        className: "action",
        width: 100,
        align: "left",
        sortable: false,
        cell: record => {
          return (
            <Fragment>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => this.editRecord(record)}
              >
                <i className="fa fa-edit"></i>
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => this.deleteRecord(record)}>
                <i className="fa fa-trash"></i>
              </button>
            </Fragment >
          );
        }
      }
    ];
    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      button: {
        excel: true,
        print: true,
        extra: true,
      }
    }

    this.state = {
      records: [
        {
          "id": "55f14312c7447c3da7051b26",
          "address": "228 City Road",
          "name": ".CN Chinese",
          "postcode": "3JH",
          "rating": 5,
          "type_of_food": "Chinese"
        },
        {
          "id": "55f14312c7447c3da7051b27",
          "address": "376 Rayleigh Road",
          "name": "@ Thai",
          "postcode": "5PT",
          "rating": 5.5,
          "type_of_food": "Thai"
        },
        {
          "id": "55f14312c7447c3da7051b28",
          "address": "30 Greyhound Road Hammersmith",
          "name": "@ Thai Restaurant",
          "postcode": "8NX",
          "rating": 4.5,
          "type_of_food": "Thai"
        },
        {
          "id": "55f14312c7447c3da7051b29",
          "address": "30 Greyhound Road Hammersmith",
          "name": "@ Thai Restaurant",
          "postcode": "8NX",
          "rating": 4.5,
          "type_of_food": "Thai"
        }
      ]
    }
    this.extraButtons = [
      {
        className: "btn btn-primary buttons-pdf",
        title: "Export TEst",
        children: [
          <span>
            <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
          </span>
        ],
        onClick: (event) => {
          console.log(event);
        },
      },
      {
        className: "btn btn-primary buttons-pdf",
        title: "Export TEst",
        children: [
          <span>
            <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
          </span>
        ],
        onClick: (event) => {
          console.log(event);
        },
        onDoubleClick: (event) => {
          console.log("doubleClick")
        }
      },
    ]
  }

  editRecord(record) {
    console.log("Edit Record", record);
  }

  deleteRecord(record) {
    console.log("Delete Record", record);
  }

  render() {
    return (
      <div>
        <ReactDatatable
          config={this.config}
          records={this.state.records}
          columns={this.columns}
          extraButtons={this.extraButtons}
        />
      </div>
    )
  }
}

export default IncidentTableComponent;