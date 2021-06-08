import { connect } from "react-redux";
import { getIncidentsAsync } from "redux/incidents/actions";

const IncidentViewer = ({ state, getIncidentsAsync }) => {
  return (
    <div>
      <button onClick={() => getIncidentsAsync()}>getIncidentsAsync</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

const mapStateToProps = (state) => ({
  state: state.incidents,
});

const mapDispatchToProps = (dispatch) => ({
  getIncidentsAsync: () => dispatch(getIncidentsAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentViewer);
