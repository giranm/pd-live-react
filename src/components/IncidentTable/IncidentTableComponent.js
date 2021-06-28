import { connect } from "react-redux";

import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';

import {
  Button,
} from 'react-bootstrap';

// import { ReactComponent as EmptyIncidents } from "assets/images/empty_incidents.svg"

import IncidentTableSettingsComponent from "./IncidentTableSettingsComponent";

import 'react-data-table-component-extensions/dist/index.css';
import "./IncidentTableComponent.css";

import {
  toggleIncidentTableSettings,
  selectIncidentTableRows,
} from "redux/incident_table/actions";

const EmptyIncidentsComponent = () => {
  return (
    <div>
      {/* <EmptyIncidents /> cannot import this for some reason */}
      No incidents found!
    </div>
  )
}

const IncidentTableComponent = ({
  toggleIncidentTableSettings,
  selectIncidentTableRows,
  incidentTableSettings,
  incidents
}) => {
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
          onSelectedRowsChange={
            ({ allSelected, selectedCount, selectedRows }) =>
              selectIncidentTableRows(allSelected, selectedCount, selectedRows)
          }
        />
      </DataTableExtensions>
      {incidents.length ? (
        <div className="incident-table-settings-ctr">
          <Button
            className="incident-table-settings-btn"
            variant="secondary"
            size="sm"
            onClick={toggleIncidentTableSettings}
          >
            Settings
          </Button>
        </div>
      ) : (
        <></>
      )}
      <IncidentTableSettingsComponent />
    </div>
  )
}

const mapStateToProps = (state) => ({
  incidentTableSettings: state.incidentTableSettings,
  incidents: state.incidents.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  selectIncidentTableRows: (allSelected, selectedCount, selectedRows) =>
    dispatch(selectIncidentTableRows(allSelected, selectedCount, selectedRows))
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableComponent);