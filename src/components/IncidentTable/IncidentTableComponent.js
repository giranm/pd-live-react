import { connect } from "react-redux";

import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';

// import { ReactComponent as EmptyIncidents } from "assets/images/empty_incidents.svg"

import 'react-data-table-component-extensions/dist/index.css';
import "./IncidentTableComponent.css";

const EmptyIncidentsComponent = () => {
  return (
    <div>
      {/* <EmptyIncidents /> cannot import this for some reason */}
      No incidents found!
    </div>
  )
}

const IncidentTableComponent = ({ incidentTableSettings, incidents }) => {
  let { incidentTableColumns } = incidentTableSettings;

  return (
    <div className="incident-table-ctr">
      <DataTableExtensions
        columns={incidentTableColumns}
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
          noDataComponent={EmptyIncidentsComponent()}
        />
      </DataTableExtensions>
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentTableSettings: state.incidentTableSettings,
  incidents: state.incidents.incidents,
});

export default connect(mapStateToProps)(IncidentTableComponent);