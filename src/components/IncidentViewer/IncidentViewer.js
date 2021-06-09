import { connect } from "react-redux";
import { getIncidentsAsync } from "redux/incidents/actions";

const IncidentViewer = ({ state, getIncidentsAsync }) => {
  let since = new Date("2021-06-09")
  let until = new Date()
  return (
    <div>
      <button onClick={() => getIncidentsAsync(since, until)}>getIncidentsAsync</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

const mapStateToProps = (state) => ({
  state: state.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  getIncidentsAsync: (since, until) => dispatch(getIncidentsAsync(since, until)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentViewer);
