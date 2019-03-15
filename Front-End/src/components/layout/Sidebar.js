import React, { Component } from 'react'
import UploadFile from '../storage/UploadFile';


class SideBar extends Component {
    render() {
        return (

          
                <div class="row">
                    <div class="col-md-1 px-1 bg-dark position-fixed" id="sticky-sidebar">
                        <div className="row">
                            <div className="col">
                                <UploadFile />
                            </div>
                        </div>
                    </div>
                </div>
            
        )
    }
}

export default SideBar