import React from "react";
import { Link } from "@reach/router";
import MuiLink from "@material-ui/core/Link";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link ref={ref} {...props} />
));

const RouterLink = props => <MuiLink {...props} component={AdapterLink} />;

export default RouterLink;
