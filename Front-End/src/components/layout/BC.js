import React from "react";
import { Link } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";

const PureBreadcrumbs = ({ breadcrumbs }) => {
  // <div className="breadcrumbs">
  //   {breadcrumbs.map(({ breadcrumb, match }, index) => (
  //     <div className="bc" key={match.url}>
  //       <Link  className="nav-item nav-link" to={match.url || ""}>{breadcrumb}</Link>>
  //     </div>
  //   ))}

  // </div>
  const trail = breadcrumbs.map(({breadcrumb, match})=>{
    if(match.url === "/home"){
      return
    }
    return(
      <div className="bc" key={match.url}>
       <Link  className="nav-item nav-link" to={match.url || ""}>{breadcrumb}</Link>>
      </div>
    )
  })
  return(
    trail
  )
  } 


export default withBreadcrumbs()(PureBreadcrumbs);
