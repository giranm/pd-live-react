import {
  configure,
} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// eslint-disable-next-line import/no-extraneous-dependencies
import replaceAllInserter from 'string.prototype.replaceall';

configure({ adapter: new Adapter() });
replaceAllInserter.shim();
