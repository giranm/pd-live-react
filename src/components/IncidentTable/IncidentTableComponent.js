import {
  useEffect, useState, useMemo, forwardRef, useRef,
} from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import {
  useTable, useSortBy, useRowSelect, useBlockLayout, useResizeColumns,
} from 'react-table';

import { toggleIncidentTableSettings, selectIncidentTableRows } from 'redux/incident_table/actions';

// import { ReactComponent as EmptyIncidents } from "assets/images/empty_incidents.svg"

import IncidentTableSettingsComponent from './IncidentTableSettingsComponent';

// import 'react-data-table-component-extensions/dist/index.css';
import './IncidentTableComponent.css';

const EmptyIncidentsComponent = () => (
  <div>
    {/* <EmptyIncidents /> cannot import this for some reason */}
    No incidents found!
  </div>
);

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

const IncidentTableComponent = ({
  toggleIncidentTableSettings,
  selectIncidentTableRows,
  incidentTableSettings,
  incidents,
}) => {
  const { incidentTableColumns } = incidentTableSettings;

  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    resetResizing,
    selectedFlatRows,
    state,
  } = useTable(
    {
      columns: incidentTableColumns,
      data: incidents,
      defaultColumn,
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
    },
    useSortBy,
    useRowSelect,
    useBlockLayout,
    useResizeColumns,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          disableResizing: true,
          minWidth: 35,
          width: 35,
          maxWidth: 35,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  useEffect(() => {
    const selectedRows = selectedFlatRows.map((row) => row.original);
    selectIncidentTableRows(true, selectedRows.length, selectedRows);
    return () => { };
  }, [selectedFlatRows]);

  return (
    <div className="incident-table-ctr">
      <BTable responsive="sm" striped bordered hover size="sm" {...getTableProps()}>
        <table className="table">
          <thead className="thead">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    {column.canResize && (
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="tbody">
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="td">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </BTable>
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
  );
};

const mapStateToProps = (state) => ({
  incidentTableSettings: state.incidentTableSettings,
  incidents: state.incidents.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  selectIncidentTableRows: (allSelected, selectedCount, selectedRows) => dispatch(selectIncidentTableRows(allSelected, selectedCount, selectedRows)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableComponent);
