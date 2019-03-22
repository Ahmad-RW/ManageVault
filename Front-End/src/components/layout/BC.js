import React from "react";
import { Link } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";

const PureBreadcrumbs = ({ breadcrumbs }) => {
  const trail = breadcrumbs.map(({breadcrumb, match})=>{
    if(match.url === "/home"){
      return
    }
    return(
      <div className="bc navWelcome" key={match.url}>
       <Link  className="nav-item nav-link" to={match.url || ""}> <small>{breadcrumb}</small></Link> >
      </div>
    )
  })
  return(
    trail
  )
  } 


export default withBreadcrumbs()(PureBreadcrumbs);
