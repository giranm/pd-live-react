import { connect } from "react-redux";

import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';

import 'react-data-table-component-extensions/dist/index.css';
import "./IncidentTableComponent.css";

const IncidentTableComponent = ({ incidents }) => {
  let columns = [
    {
      selector: "incident_number",
      name: "#",
      sortable: true,
      width: "80px"
    },
    {
      selector: "status",
      name: "Status",
      className: "status",
      sortable: true,
      width: "100px"
    },
    {
      selector: "priority.summary", // need to flatten this
      name: "Priority",
      sortable: true,
      width: "100px"
    },
    {
      selector: "title",
      name: "Title",
      sortable: true,
      minWidth: "700px"
    },
    {
      selector: "created_at",
      name: "Created At",
      sortable: true,
    },
    {
      selector: "service.summary", // need to flatten this
      name: "Service/Node",
      sortable: true,
    },
  ];

  return (
    <div className="incident-table-ctr">
      <DataTableExtensions
        columns={columns}
        data={incidents}>
        <DataTable
          noHeader
          striped
          highlightOnHover
          selectableRows
          selectableRowsHighlight
          fixedHeader
          fixedHeaderScrollHeight={"45vh"}
          pagination={true}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
        />
      </DataTableExtensions>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidents: state.incidents.incidents,
});

export default connect(mapStateToProps)(IncidentTableComponent);