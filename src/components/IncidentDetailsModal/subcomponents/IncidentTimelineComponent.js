import {
  connect,
} from 'react-redux';

const IncidentTimelineComponent = ({
  incidentDetails,
}) => {
  const {
    incident,
  } = incidentDetails;
  if (incident) console.log('hacking eslint for now');
  return (
    <div>
      <p>IncidentTimelineComponent Placeholder</p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentDetails: state.incidentDetails,
});

const mapDispatchToProps = (dispatch) => ({
  placeholder: () => dispatch(() => {}),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentTimelineComponent);
