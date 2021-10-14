/* eslint-disable no-nested-ternary */
import {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import mezr from 'mezr';

import {
  Button,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Badge,
  Container,
} from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import {
  useTable,
  useSortBy,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
  usePagination,
} from 'react-table';

import { toggleIncidentTableSettings, selectIncidentTableRows } from 'redux/incident_table/actions';

import { ReactComponent as EmptyIncidents } from 'assets/images/empty_incidents.svg';

import './IncidentTableComponent.scss';

const EmptyIncidentsComponent = () => (
  <div className="empty-incidents">
    <EmptyIncidents />
    <h1 className="empty-incidents-badge">
      <Badge bg="primary">No Incidents Found</Badge>
    </h1>
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
  querySettings,
  toggleIncidentTableSettings,
  selectIncidentTableRows,
  incidentTableSettings,
  incidents,
}) => {
  const { displayQuerySettings } = querySettings;
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

  const {
    state: { pageIndex, pageSize },
    // Core Table
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows, // Disabled as we are using pagination (see variable substitute)
    prepareRow,
    selectedFlatRows,
    // Pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
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
      // Pagination
      initialState: { pageIndex: 0 },
    },
    // Plugins
    useSortBy,
    usePagination,
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
    ? mezr.height(incidentActionsEl) + 20
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
            style={{ height: `${distanceBetweenQueryAndAction - incidentActionsHeight}px` }}
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
                  {page.map((row, i) => {
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
          </div>
          <br />
          <div>
            <div
              className="incident-table-settings-ctr"
              style={{ bottom: `${incidentActionsHeight - 10}px` }}
            >
              <Container fluid>
                <Row>
                  <Col />
                  <Col className="pagination-setting-pages" sm={{ span: -1 }}>
                    <DropdownButton
                      size="sm"
                      variant="secondary"
                      title={`Show ${pageSize} results`}
                      drop="up"
                    >
                      {[10, 25, 50, 100].map((pgSize) => (
                        <Dropdown.Item
                          key={pgSize}
                          name={pgSize}
                          onClick={(e) => {
                            setPageSize(Number(e.target.name, 10));
                          }}
                        >
                          Show {pgSize} results
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                    <div className="mr-2" />
                    <Button
                      className="pagination-buttons"
                      variant="secondary"
                      size="sm"
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                    >
                      {'<<'}
                    </Button>
                    <Button
                      className="pagination-buttons"
                      variant="secondary"
                      size="sm"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      {'<'}
                    </Button>
                    <div className="pagination-current-page-badge">
                      <Badge
                        className="pagination-buttons"
                        variant="dark"
                      >
                        {`Page ${pageIndex + 1} of ${pageOptions.length}`}
                      </Badge>
                    </div>
                    <Button
                      className="pagination-buttons"
                      variant="secondary"
                      size="sm"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      {'>'}
                    </Button>
                    <Button
                      className="pagination-buttons"
                      variant="secondary"
                      size="sm"
                      onClick={() => gotoPage(pageCount - 1)}
                      disabled={!canNextPage}
                    >
                      {'>>'}
                    </Button>
                    {/* Disabling until we have better UX */}
                    {/* <Form.Control
                    type="number"
                    size="sm"
                    min={1}
                    max={pageCount}
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const targetPage = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(targetPage);
                    }}
                  /> */}
                  </Col>
                </Row>
              </Container>
            </div>
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
  querySettings: state.querySettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIncidentTableSettings: () => dispatch(toggleIncidentTableSettings()),
  selectIncidentTableRows: (allSelected, selectedCount, selectedRows) => {
    dispatch(selectIncidentTableRows(allSelected, selectedCount, selectedRows));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTableComponent);
