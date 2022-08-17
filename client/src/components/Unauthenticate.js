import React from "react";
import { Route, Redirect } from "react-router-dom";


export default function Unauthenticate({ component: C, appProps, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          appProps ? <Redirect to={`/tasks?redirect=${props.location.pathname}${props.location.search}`} /> : <C {...props} {...appProps}  />}
      />
    );
  }