import {
  connect,
} from 'react-redux';

const AlertsTableComponent = ({
  incidentDetails,
}) => {
  const {
    incident,
  } = incidentDetails;
  if (incident) console.log('hacking eslint for now');
  return (
    <div>
      <p>AlertsTableComponent Placeholder</p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  incidentDetails: state.incidentDetails,
});

const mapDispatchToProps = (dispatch) => ({
  placeholder: () => dispatch(() => {}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertsTableComponent);
