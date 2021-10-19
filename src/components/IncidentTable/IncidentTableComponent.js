/* eslint-disable no-nested-ternary */
import {
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { connect } from 'react-redux';

import mezr from 'mezr';
import { FixedSizeList } from 'react-window';

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

const IncidentTableComponent = ({
  toggleIncidentTableSettings,
  selectIncidentTableRows,
  incidentTableSettings,
  incidents,
}) => {
  const { incidentTableColumns } = incidentTableSettings;
  const { filteredIncidentsByQuery } = incidents;

  // React Table Config
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    [],
  );

  const memoizedFilteredIncidentsByQuery = useMemo(
    () => filteredIncidentsByQuery, [filteredIncidentsByQuery],
  );

  const scrollBarSize = useMemo(() => scrollbarWidth(), []);

  const {
    state: { selectedRowIds },
    // Core Table
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
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <CheckboxComponent {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
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

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr
          {...row.getRowProps({
            style,
          })}
          className="tr"
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

  // Dynamic Table Height
  const querySettingsEl = document.getElementById('query-settings-ctr');
  const incidentActionsEl = document.getElementById('incident-actions-ctr');
  const incidentActionsHeight = incidentActionsEl
    ? mezr.height(incidentActionsEl) + 50
    : 0;
  const distanceBetweenQueryAndAction = incidentActionsEl
    ? mezr.distance([querySettingsEl, 'border'], [incidentActionsEl, 'border'])
    : 0;

  return (
    <div className="incident-table-ctr">
      {memoizedFilteredIncidentsByQuery && memoizedFilteredIncidentsByQuery.length ? (
        <div>
          <div
            className="incident-table"
          >
            <BTable
              responsive="sm"
              striped
              hover
              size="sm"
              {...getTableProps()}
            >
              <table className="table">
                <thead className="thead">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
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
                    itemSize={50}
                    width={totalColumnsWidth + scrollBarSize}
                  >
                    {RenderRow}
                  </FixedSizeList>
                </tbody>
              </table>
            </BTable>
          </div>
        </div>
      ) : (
        <EmptyIncidentsComponent />
      )}
    </div>
  );
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
