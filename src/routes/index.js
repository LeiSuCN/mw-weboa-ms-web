import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import App from '../components/App';
import NotFound from '../components/NotFound';
import Notices from '../components/Notices/Notices';
import NoticeEditor from '../components/Notices/NoticeEditor';


const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/" component={NoticeEditor} />
    <Route path="/notice/editor" component={NoticeEditor} />
    <Route path="/completed" component={App} />
    <Route path="*" component={NotFound}/>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
