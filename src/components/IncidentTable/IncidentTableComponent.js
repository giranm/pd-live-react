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

// class IncidentTableComponent extends React.Component {
//   constructor(props) {
//     super(props);

//     this.pagerduty = new PagerDuty(process.env.REACT_APP_PD_TOKEN);

//     // TODO: Move logic for table initialisation
//     this.columns = [
//       {
//         selector: "incident_number",
//         name: "#",
//         sortable: true,
//         width: "80px"
//       },
//       {
//         selector: "status",
//         name: "Status",
//         className: "status",
//         sortable: true,
//         width: "100px"
//       },
//       {
//         selector: "priority.summary", // need to flatten this
//         name: "Priority",
//         sortable: true,
//         width: "100px"
//       },
//       {
//         selector: "title",
//         name: "Title",
//         sortable: true,
//         minWidth: "700px"
//       },
//       {
//         selector: "created_at",
//         name: "Created At",
//         sortable: true,
//       },
//       {
//         selector: "service.summary", // need to flatten this
//         name: "Service/Node",
//         sortable: true,
//       },
//       {
//         selector: "teams[0].summary", // need to flatten this
//         name: "Team",
//         sortable: true,
//       },
//       // {
//       //   selector: "assignments", // need to flatten this
//       //   name: "Assigned To",
//       //   sortable: true,
//       // },
//     ];

//     this.selectOptions = [
//       { value: 'team1', label: 'team1' },
//       { value: 'team2', label: 'team2' },
//       { value: 'team3', label: 'team3' }
//     ]

//     this.state = {
//       // data: mockIncidentData()
//       data: []
//     }

//   }

//   render() {

//     let until = new Date();
//     until.setHours(23, 59, 59, 999);

//     let since = new Date();
//     since.setDate(until.getDate() - 1);
//     since.setHours(0, 0, 0, 0)

//     // let incidents = this.pagerduty.fetchIncidents(since, until)
//     // console.log("Fetched incidents", incidents)

//     return (
//       <div>
//         <br />
//         <div className="incidents-table-config">
//           <Accordion defaultActiveKey="0">
//             <Card bg="light">
//               <Card.Header>
//                 <Accordion.Toggle as={Button} variant="outline-dark" eventKey="0">
//                   Incident Query Settings
//                 </Accordion.Toggle>
//               </Card.Header>
//               <Accordion.Collapse eventKey="0">
//                 <Card.Body>
//                   <Row>
//                     <Col xs="auto">
//                       Since:
//                 <Form.Control className="mb-2" type="date" name='since' />
//                     </Col>
//                     <Col xs="auto">
//                       Until:
//                 <Form.Control type="date" name='until' />
//                     </Col>
//                     <Col xs="auto">
//                       State: {' '}
//                       <Form.Group>
//                         <ButtonGroup>
//                           <Button variant="success">All</Button>
//                           <Button variant="secondary">Triggered</Button>
//                           <Button variant="secondary">Acknowleged</Button>
//                           <Button variant="secondary">Resolved</Button>
//                         </ButtonGroup>
//                       </Form.Group>
//                     </Col>
//                     <Col xs="auto">
//                       Priorities: {' '}
//                       <Form.Group>
//                         <ButtonGroup>
//                           {/* To be generated from API */}
//                           <Button variant="success">P1</Button>
//                           <Button variant="success">P2</Button>
//                           <Button variant="secondary">P3</Button>
//                           <Button variant="secondary">P4</Button>
//                           <Button variant="secondary">P5</Button>
//                           <Button variant="outline-secondary">Clear</Button>
//                         </ButtonGroup>
//                       </Form.Group>
//                     </Col>
//                     <Col xs="auto">
//                       Urgency: {' '}
//                       <Form.Group>
//                         <ButtonGroup>
//                           <Button variant="success">All</Button>
//                           <Button variant="secondary">High</Button>
//                           <Button variant="secondary">Low</Button>
//                         </ButtonGroup>
//                       </Form.Group>
//                     </Col>
//                     <Col>
//                       Team: {' '}
//                       <Form.Group>
//                         <Select options={this.selectOptions} />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Accordion.Collapse>
//             </Card>
//           </Accordion>
//         </div>
//         <br />
//         <div className="incidents-table">
//           <DataTableExtensions
//             columns={this.columns}
//             data={this.state.data}>
//             <DataTable
//               noHeader
//               striped
//               highlightOnHover
//               selectableRows
//               selectableRowsHighlight
//               fixedHeader
//               fixedHeaderScrollHeight={"45vh"}
//               pagination={true}
//               paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
//             />
//           </DataTableExtensions>
//         </div>
//         <div className="incidents-table-actions">
//           <Container fluid>
//             <Row>
//               <Col md={4}>
//                 <Button variant="warning">Acknowledge</Button>&nbsp;
//                 <Button variant="danger">Escalate</Button>&nbsp;
//                 <Button variant="secondary">Reassign</Button>&nbsp;
//                 <Button variant="secondary">Snooze</Button>&nbsp;
//                 <Button variant="success">Resolve</Button>&nbsp;
//               </Col>
//               <Col md={{ span: 3, offset: 5 }}>
//                 <Button variant="info">Update Priority</Button>&nbsp;
//                 <Button variant="info">Add Note</Button>&nbsp;
//                 <Button variant="info">Run Action</Button>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </div >
//     )
//   }
// }

// export default IncidentTableComponent;