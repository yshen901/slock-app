import React from 'react';
import { Link } from 'react-router-dom';

class AuthFooter extends React.Component {
  render() {
    return (
      <div id="auth-footer">
        <div className="auth-footer-column">
          <h6 className="orange">USING SLOCK</h6>
          <Link className="auth-footer-link" to="/tbd">Product</Link>
          <Link className="auth-footer-link" to="/tbd">Enterprise</Link>
          <Link className="auth-footer-link" to="/tbd">Pricing</Link>
          <Link className="auth-footer-link" to="/tbd">Support</Link>
          <Link className="auth-footer-link" to="/tbd">Slack Guides</Link>
          <Link className="auth-footer-link" to="/tbd">App Directory</Link>
          <Link className="auth-footer-link" to="/tbd">API</Link>
        </div>

        <div className="auth-footer-column">
          <h6 className="pink">SLOCK</h6>
          <Link className="auth-footer-link" to="/tbd">Jobs</Link>
          <Link className="auth-footer-link" to="/tbd">Customers</Link>
          <Link className="auth-footer-link" to="/tbd">Developers</Link>
          <Link className="auth-footer-link" to="/tbd">Events</Link>
          <Link className="auth-footer-link" to="/tbd">Blog</Link>
        </div>

        <div className="auth-footer-column">
          <h6 className="green">LEGAL</h6>
          <Link className="auth-footer-link" to="/tbd">Privacy</Link>
          <Link className="auth-footer-link" to="/tbd">Security</Link>
          <Link className="auth-footer-link" to="/tbd">Terms of Service</Link>
          <Link className="auth-footer-link" to="/tbd">Policies</Link>
        </div>

        <div className="auth-footer-column">
          <h6 className="blue">HANDY LINKS</h6>
          <Link className="auth-footer-link" to="/tbd">Download desktop app</Link>
          <Link className="auth-footer-link" to="/tbd">Download mobile app</Link>
          <Link className="auth-footer-link" to="/tbd">Brand Guidelines</Link>
          <Link className="auth-footer-link" to="/tbd">Slock at Work</Link>
          <Link className="auth-footer-link" to="/tbd">Status</Link>
        </div>
      </div>
    )
  }
}

export default AuthFooter;