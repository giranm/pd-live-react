/* eslint-disable no-nested-ternary */
import {
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { connect } from 'react-redux';

import mezr from 'mezr';
import { FixedSizeList } from 'react-window';

import {
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import {
  useTable,
  useSortBy,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
} from 'react-table';

import { toggleIncidentTableSettings, selectIncidentTableRows } from 'redux/incident_table/actions';

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
const Delayed = ({ children, waitBeforeShow = 500 }) => {
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
  toggleIncidentTableSettings,
  selectIncidentTableRows,
  incidentTableSettings,
  incidents,
}) => {
  const { incidentTableColumns } = incidentTableSettings;
  const { filteredIncidentsByQuery, fetchingIncidents } = incidents;

  // React Table Config
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 1000,
    }),
    [],
  );

  const memoizedFilteredIncidentsByQuery = useMemo(
    () => filteredIncidentsByQuery, [filteredIncidentsByQuery],
  );

  const scrollBarSize = useMemo(() => scrollbarWidth(), []);

  // Dynamic Table Height
  const querySettingsEl = document.getElementById('query-settings-ctr');
  const incidentActionsEl = document.getElementById('incident-actions-ctr');
  const incidentActionsHeight = incidentActionsEl
    ? mezr.height(incidentActionsEl) + 50
    : 0;
  const distanceBetweenQueryAndAction = incidentActionsEl
    ? mezr.distance([querySettingsEl, 'border'], [incidentActionsEl, 'border'])
    : 0;

  // Create instance of react-table with options and plugins
  const {
    state: { selectedRowIds },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    totalColumnsWidth,
  } = useTable(
    {
      columns: incidentTableColumns,
      data: memoizedFilteredIncidentsByQuery,
      defaultColumn,
      // Prevent re-render when redux store updates
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
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
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <CheckboxComponent {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <CheckboxComponent {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  // Custom component required for virtualized rows
  const RenderRow = useCallback(
    ({ index, style }) => {
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
            <td {...cell.getCellProps()} className="td">
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
    return () => { };
  }, [selectedFlatRows]);

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
  if (!fetchingIncidents
    && filteredIncidentsByQuery.length === 0) {
    return (
      <Delayed waitBeforeShow={4000}>
        <EmptyIncidentsComponent />
      </Delayed>
    );
  }

  if (!fetchingIncidents
    && filteredIncidentsByQuery.length > 0) {
    return (
      <div className="incident-table-ctr">
        <div
          className="incident-table"
        >
          <BTable
            responsive="sm"
            hover
            size="sm"
            {...getTableProps()}
          >
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
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' ▼'
                              : ' ▲'
                            : ''}
                        </span>
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
                <FixedSizeList
                  height={(distanceBetweenQueryAndAction - incidentActionsHeight)}
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
  incidentTableSettings: state.incidentTableSettings,
  incidents: state.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  selectIncidentTableRows: (allSelected, selectedCount, selectedRows) => {
    dispatch(selectIncidentTableRows(allSelected, selectedCount, selectedRows));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableComponent);
