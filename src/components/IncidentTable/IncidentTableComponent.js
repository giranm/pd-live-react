/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import {
  useEffect, useMemo, useCallback, useState,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  useDebouncedCallback,
} from 'use-debounce';

import mezr from 'mezr';
import {
  FixedSizeList,
} from 'react-window';

import {
  Container, Row, Spinner,
} from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import {
  useTable, useSortBy, useRowSelect, useBlockLayout, useResizeColumns,
} from 'react-table';

import {
  selectIncidentTableRows as selectIncidentTableRowsConnected,
  updateIncidentTableState as updateIncidentTableStateConnected,
} from 'redux/incident_table/actions';

import {
  getIncidentTableColumns,
} from 'config/incident-table-columns';

import CheckboxComponent from './subcomponents/CheckboxComponent';
import EmptyIncidentsComponent from './subcomponents/EmptyIncidentsComponent';

import './IncidentTableComponent.scss';

// Ref: https://davidwalsh.name/detect-scrollbar-width
const scrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;',
  );
  document.body.appendChild(scrollDiv);
  const scrollbarWidthDist = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidthDist;
};

// Ref: https://stackoverflow.com/a/61390352/6480733
const Delayed = ({
  children, waitBeforeShow = 500,
}) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? children : null;
};

const IncidentTableComponent = ({
  selectIncidentTableRows,
  updateIncidentTableState,
  incidentTable,
  incidentActions,
  incidents,
}) => {
  const {
    incidentTableState, incidentTableColumnsNames,
  } = incidentTable;
  const {
    status,
  } = incidentActions;
  const {
    filteredIncidentsByQuery, fetchingIncidents,
  } = incidents;

  // React Table Config
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 1600,
    }),
    [],
  );

  const memoizedColumns = useMemo(() => {
    // Merge current columns state with any modifications to order etc
    const columns = getIncidentTableColumns(incidentTableColumnsNames);
    const columnWidths = incidentTableState.columnResizing
      ? incidentTableState.columnResizing.columnWidths
      : null;
    const tempColumns = columns.map((col) => {
      const tempCol = { ...col };
      if (columnWidths && tempCol.accessor in columnWidths) {
        tempCol.width = columnWidths[tempCol.accessor];
      }
      return tempCol;
    });
    return tempColumns;
  }, [incidentTableColumnsNames]);

  const scrollBarSize = useMemo(() => scrollbarWidth(), []);

  // Dynamic Table Height
  const querySettingsEl = document.getElementById('query-settings-ctr');
  const incidentActionsEl = document.getElementById('incident-actions-ctr');
  const incidentActionsHeight = incidentActionsEl ? mezr.height(incidentActionsEl) + 50 : 0;
  const distanceBetweenQueryAndAction = incidentActionsEl
    ? mezr.distance([querySettingsEl, 'border'], [incidentActionsEl, 'border'])
    : 0;

  // Debouncing for table state
  const debouncedUpdateIncidentTableState = useDebouncedCallback((state, action) => {
    // Only update store with sorted and column resizing state
    if (action.type === 'toggleSortBy' || action.type === 'columnDoneResizing') {
      updateIncidentTableState(state);
    }
  }, 1000);

  // Create instance of react-table with options and plugins
  const {
    state: {
      selectedRowIds,
    },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
    totalColumnsWidth,
  } = useTable(
    {
      columns: memoizedColumns,
      data: filteredIncidentsByQuery, // Potential issue with Memoization hook?
      defaultColumn,
      // Prevent re-render when redux store updates
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
      // Enable multisort without specific event handler (i.e. shift+click)
      isMultiSortEvent: () => true,
      // Set initial state from store
      initialState: incidentTableState,
      // Handle updates to table
      stateReducer: (newState, action) => debouncedUpdateIncidentTableState(newState, action),
    },
    // Plugins
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
          Header: ({
            getToggleAllRowsSelectedProps,
          }) => (
            <div>
              <CheckboxComponent {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({
            row,
          }) => (
            <div>
              <CheckboxComponent
                data-incident-row-idx={row.index}
                data-incident-id={row.original.id}
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  // Custom component required for virtualized rows
  const RenderRow = useCallback(
    ({
      index, style,
    }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr
          {...row.getRowProps({
            style,
          })}
          className={index % 2 === 0 ? 'tr' : 'tr-odd'}
        >
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()} className="td" data-incident-header={cell.column.Header}>
              {cell.render('Cell')}
            </td>
          ))}
        </tr>
      );
    },
    [prepareRow, rows, selectedRowIds],
  );

  // Row selection hooks
  useEffect(() => {
    const selectedRows = selectedFlatRows.map((row) => row.original);
    selectIncidentTableRows(true, selectedRows.length, selectedRows);
    return () => {};
  }, [selectedFlatRows]);

  // Handle deselecting rows after incident action has completed
  useEffect(() => {
    // TODO: Get user feedback on this workflow
    if (!status.includes('TOGGLE') && status.includes('COMPLETED')) toggleAllRowsSelected(false);
  }, [status]);

  // Render components based on application state
  if (fetchingIncidents) {
    return (
      <Container fluid>
        <br />
        <Row className="justify-content-md-center">
          <Spinner className="" animation="border" role="status" variant="success" />
          <h5 className="querying-incidents">
            <b>Querying PagerDuty API</b>
          </h5>
        </Row>
      </Container>
    );
  }

  // TODO: Find a better way to prevent Empty Incidents from being shown during render
  if (!fetchingIncidents && filteredIncidentsByQuery.length === 0) {
    return (
      <Delayed waitBeforeShow={4000}>
        <EmptyIncidentsComponent />
      </Delayed>
    );
  }

  if (!fetchingIncidents && filteredIncidentsByQuery.length > 0) {
    return (
      <div className="incident-table-ctr">
        <div className="incident-table">
          <BTable responsive="sm" hover size="sm" {...getTableProps()}>
            <table className="table">
              <thead className="thead">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className={column.isSorted ? 'th-sorted' : 'th'}
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}</span>
                        {column.canResize && (
                          <div
                            {...column.getResizerProps()}
                            className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="tbody">
                <FixedSizeList
                  height={distanceBetweenQueryAndAction - incidentActionsHeight}
                  itemCount={rows.length}
                  itemSize={60}
                  width={totalColumnsWidth + scrollBarSize}
                >
                  {RenderRow}
                </FixedSizeList>
              </tbody>
            </table>
          </BTable>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  incidentTable: state.incidentTable,
  incidentActions: state.incidentActions,
  incidents: state.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  selectIncidentTableRows: (allSelected, selectedCount, selectedRows) => {
    dispatch(selectIncidentTableRowsConnected(allSelected, selectedCount, selectedRows));
  },
  updateIncidentTableState: (incidentTableState) => {
    dispatch(updateIncidentTableStateConnected(incidentTableState));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableComponent);
