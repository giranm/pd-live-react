import {
  connect,
} from 'react-redux';

import {
  OverlayTrigger, Tooltip,
} from 'react-bootstrap';

import {
  getInitials,
} from 'util/helpers';

const PersonInitialsComponent = ({
  users, displayedUsers,
}) => {
  const {
    usersMap,
  } = users;
  const displayedUsersByInitials = displayedUsers.length > 0
    ? displayedUsers.map(({
      user,
    }) => {
      let color;
      if (usersMap[user.id]) {
        color = usersMap[user.id].color.replace('-', '');
      } else {
        color = 'black';
      }
      return {
        summary: user.summary,
        initials: getInitials(user.summary),
        id: user.id,
        html_url: user.html_url,
        color: CSS.supports('color', color) ? color : 'black',
      };
    })
    : [];

  if (displayedUsersByInitials.length > 0) {
    return (
      <div>
        {displayedUsersByInitials.map((user) => (
          <OverlayTrigger
            key={user.id}
            placement="top"
            overlay={<Tooltip id={`tooltip-${user.id}`}>{user.summary}</Tooltip>}
          >
            <div
              idx={user.id}
              style={{
                backgroundColor: user.color,
                height: '32px',
                width: '32px',
                color: 'white',
                display: 'table-cell',
                textAlign: 'center',
                lineHeight: 'initial',
                verticalAlign: 'middle',
                fontWeight: 700,
                borderRadius: '100%',
              }}
            >
              {user.initials}
            </div>
          </OverlayTrigger>
        ))}
      </div>
    );
  }

  return <div />;
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps)(PersonInitialsComponent);
